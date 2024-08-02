using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayButtonHandler : MonoBehaviour
{
    // Method to load the ChickenFarm scene
    public void LoadChickenFarmScene()
    {
        SceneManager.LoadScene("ChickenFarm");
    }
}
