import base64
import httpx


GITHUB_API = "https://api.github.com"


async def get_repositories(access_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API}/user/repos",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

    response.raise_for_status()

    return response.json()


async def get_tree(
    access_token: str,
    full_name: str,
    branch: str,
):
    url = f"{GITHUB_API}/repos/{full_name}/git/trees/{branch}?recursive=1"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

    response.raise_for_status()

    return response.json()


async def get_blob(
    access_token: str,
    full_name: str,
    sha: str,
):
    url = f"{GITHUB_API}/repos/{full_name}/git/blobs/{sha}"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

    response.raise_for_status()

    data = response.json()

    return base64.b64decode(
        data["content"]
    ).decode("utf-8")