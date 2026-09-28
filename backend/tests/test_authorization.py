from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.diary import DiaryEntry
from app.models.tag import Tag

def test_user_cannot_read_others_entries(client: TestClient, user_token_headers: dict, user2_token_headers: dict, test_user):
    # User 1 creates an entry
    response = client.post(
        "/api/entries",
        headers=user_token_headers,
        json={"title": "User 1 Secret", "content": "Private"}
    )
    assert response.status_code == 201
    entry_id = response.json()["id"]

    # User 2 tries to read it
    response2 = client.get(
        f"/api/entries/{entry_id}",
        headers=user2_token_headers
    )
    assert response2.status_code == 404 # Should be completely hidden

def test_user_cannot_update_others_entries(client: TestClient, user_token_headers: dict, user2_token_headers: dict):
    # User 1 creates an entry
    response = client.post(
        "/api/entries",
        headers=user_token_headers,
        json={"title": "User 1 Secret", "content": "Private"}
    )
    entry_id = response.json()["id"]

    # User 2 tries to update it
    response2 = client.put(
        f"/api/entries/{entry_id}",
        headers=user2_token_headers,
        json={"title": "Hacked", "content": "Hacked"}
    )
    assert response2.status_code == 404

def test_user_cannot_delete_others_entries(client: TestClient, user_token_headers: dict, user2_token_headers: dict):
    response = client.post(
        "/api/entries",
        headers=user_token_headers,
        json={"title": "User 1 Secret", "content": "Private"}
    )
    entry_id = response.json()["id"]

    response2 = client.delete(
        f"/api/entries/{entry_id}",
        headers=user2_token_headers
    )
    assert response2.status_code == 404
    
def test_user_cannot_delete_others_tags(client: TestClient, user_token_headers: dict, user2_token_headers: dict):
    response = client.post(
        "/api/tags",
        headers=user_token_headers,
        json={"name": "User1Tag", "color": "blue"}
    )
    tag_id = response.json()["id"]

    response2 = client.delete(
        f"/api/tags/{tag_id}",
        headers=user2_token_headers
    )
    assert response2.status_code == 404
