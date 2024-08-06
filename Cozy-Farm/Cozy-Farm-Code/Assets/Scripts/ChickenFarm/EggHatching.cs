using UnityEngine;

public class EggHatching : MonoBehaviour
{
    public GameObject chickPrefab;

    private GameManager gameManager;

    public float hatchTime = 10f;

    void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
        // Start the hatching process
        Invoke("Hatch", hatchTime);
    }

    void Hatch()
    {
        // Instantiate a chick at the egg's position
        GameObject hatchedChick = Instantiate(chickPrefab, transform.position, Quaternion.identity);
        // Notify the game manager that an egg has hatched
        gameManager.AddHatchedChick(hatchedChick);
        // Destroy the egg
        Destroy(gameObject);
    }
}
