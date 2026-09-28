from fastapi.testclient import TestClient

def test_create_tag(client: TestClient, user_token_headers: dict):
    response = client.post(
        "/api/tags",
        headers=user_token_headers,
        json={"name": "CustomTag", "color": "red"}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "CustomTag"

def test_get_tags(client: TestClient, user_token_headers: dict):
    response = client.get(
        "/api/tags",
        headers=user_token_headers
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
