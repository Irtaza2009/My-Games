using UnityEngine;
using UnityEngine.SceneManagement;

public class FarmSwitchButtonHandler : MonoBehaviour
{
    public void SwitchToChickenFarm()
    {
        GameManager.Instance.SaveGameState();
        SceneManager.LoadScene("ChickenFarm");
        GameManager.Instance.LoadGameState();
    }

    public void SwitchToCowFarm()
    {
        GameManager.Instance.SaveGameState();
        SceneManager.LoadScene("CowFarm");
        GameManager.Instance.LoadGameState();
    }

     public void SwitchToGarden()
    {
        GameManager.Instance.SaveGameState();
        SceneManager.LoadScene("Garden");
        GameManager.Instance.LoadGameState();
    }



}
