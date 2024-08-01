using UnityEngine;

public class Coin : MonoBehaviour
{
    void OnMouseDown()
    {
        // Add code to increment the player's coin count
        Destroy(gameObject);
    }
}
