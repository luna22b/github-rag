from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import (
    ChatMessage,
    ChatSession,
    ChatSource,
)
from app.rag.retriever import retrieve_similar_chunks
from app.rag.llm_service import llm_service
from app.chat.schemas import ChatRequest


router = APIRouter()


@router.post("/repositories/{repository_id}/chats")
def create_chat(
    repository_id: int,
    db: Session = Depends(get_db),
):
    chat = ChatSession(
        repository_id=repository_id,
        title="New Chat",
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


@router.get("/repositories/{repository_id}/chats")
def get_chats(
    repository_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.repository_id == repository_id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )


@router.get("/chats/{chat_id}")
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
):
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id)
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == chat_id)
        .order_by(ChatMessage.created_at)
        .all()
    )

    return {
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
        "messages": messages,
    }

@router.post("/sessions/{session_id}/messages")
async def chat(
    session_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    chat_session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id)
        .first()
    )

    if not chat_session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found",
        )

    repository_id = chat_session.repository_id

    user_message = ChatMessage(
        session_id=session_id,
        role="user",
        content=request.question,
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    is_repo_question = await llm_service.is_repository_question(
        request.question
    )

    chunks = []

    if is_repo_question:
        chunks = await retrieve_similar_chunks(
            db=db,
            repository_id=repository_id,
            query=request.question,
        )

    answer = await llm_service.generate(
        question=request.question,
        chunks=chunks,
    )

    sources = []

    if chunks:
        sources = list(
            {
                chunk.repository_file.path
                for chunk in chunks
            }
        )

    assistant_message = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=answer,
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)


    for source_file in sources:
        source = ChatSource(
            message_id=assistant_message.id,
            file=source_file,
        )

        db.add(source)

    db.commit()

    db.refresh(chat_session)


    return {
        "answer": answer,
        "sources": sources,
    }

@router.delete("/chats/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
):
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id)
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    db.delete(chat)
    db.commit()

    return {
        "message": "Chat deleted successfully"
    }