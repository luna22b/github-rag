from pydantic import BaseModel, ConfigDict


class RepositoryResponse(BaseModel):
    id: int
    github_repo_id: int
    name: str
    full_name: str
    description: str | None
    private: bool
    default_branch: str
    html_url: str

    model_config = {"from_attributes": True}


class ImportRepositoryResponse(BaseModel):
    message: str
    files_indexed: int
