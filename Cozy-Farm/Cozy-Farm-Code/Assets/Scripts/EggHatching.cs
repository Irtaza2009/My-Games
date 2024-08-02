using UnityEngine;

public class EggHatching : MonoBehaviour
{
    public GameObject chickPrefab;
    public float hatchTime = 10f;

    void Start()
    {
        // Start the hatching process
        Invoke("Hatch", hatchTime);
    }

    void Hatch()
    {
        // Instantiate a chick at the egg's position
        Instantiate(chickPrefab, transform.position, Quaternion.identity);
        // Destroy the egg
        Destroy(gameObject);
    }
}
