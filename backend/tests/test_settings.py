from fastapi.testclient import TestClient

def test_get_settings(client: TestClient, user_token_headers: dict):
    response = client.get("/api/settings", headers=user_token_headers)
    assert response.status_code == 200
    assert "appearance" in response.json()
    assert "theme" in response.json()["appearance"]

def test_update_settings(client: TestClient, user_token_headers: dict):
    response = client.put(
        "/api/settings",
        headers=user_token_headers,
        json={
            "appearance": { "theme": "dark" },
            "notifications": { "entryReminders": True, "tagNotifications": False },
            "profile": { "displayName": "Updated Name", "email": "test@example.com", "avatarUrl": None }
        }
    )
    assert response.status_code == 200
    assert response.json()["appearance"]["theme"] == "dark"
    
    response2 = client.get("/api/auth/me", headers=user_token_headers)
    assert response2.json()["name"] == "Updated Name"
