using UnityEngine;
using UnityEngine.SceneManagement;

public class FarmSwitchButtonHandler : MonoBehaviour
{

    public void SwitchToLeaderboard()
    {
        GameManager.Instance.SaveGameState();
        PlayerPrefs.SetInt("previousScene", SceneManager.GetActiveScene().buildIndex);
        PlayerPrefs.Save();
        SceneManager.LoadScene("leaderboard");
        GameManager.Instance.LoadGameState();
    }
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

    public void SwitchToPreviousScene()
    {

        if (PlayerPrefs.GetInt("previousScene") == 0)
        {
            PlayerPrefs.SetInt("previousScene", 1);
            PlayerPrefs.Save();
        }
        Debug.Log("Switching to previous scene: " + PlayerPrefs.GetInt("previousScene"));
        SceneManager.LoadScene(PlayerPrefs.GetInt("previousScene"));


    }



}
