using UnityEngine;
using UnityEngine.SceneManagement;

public class FarmSwitchButtonHandler : MonoBehaviour
{
    public void SwitchToChickenFarm()
    {
        SceneManager.LoadScene("ChickenFarm");
    }

    public void SwitchToCowFarm()
    {
        SceneManager.LoadScene("CowFarm");
    }
}
