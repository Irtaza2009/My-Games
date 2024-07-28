using System.Collections.Generic;
using UnityEngine;

public class TileBoard : MonoBehaviour
{

   public Tile tilePrefab;
   public TileState[] tileStates;


   private TileGrid grid;

   private List<Tile> tiles;

   private void Awake()
   {
       grid = GetComponentInChildren<TileGrid>();
       tiles = new List<Tile>(16);
   }

   private void Start()
   {
       CreateTile();
       CreateTile();
   }

   private void CreateTile()
   {
       Tile tile = Instantiate(tilePrefab, grid.transform);
       tile.SetState(tileStates[0], 2);
       tile.Spawn(grid.GetRandomEmptyCell());
       tiles.Add(tile);

   }


   private void Update()
   {
       if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow))
       {
           MoveTiles(Vector2Int.up, 0, 1,  1, 1);
       }
       else if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow))
       {
          MoveTiles(Vector2Int.down, 0, 1, grid.height - 2, -1);
       }
       else if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow))
       {
           MoveTiles(Vector2Int.left, 1, 1, 0, 1);
       }
       else if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow))
       {
           MoveTiles(Vector2Int.right, grid.width - 2, -1, 0, 1);
       }
   }

   private void MoveTiles(Vector2Int direction, int startX, int incrementX, int startY, int incrementY)
   {
       for (int x = startX; x >= 0 && x < grid.width && x >= 0; x += incrementX)
       {
           for (int y = startY; y >= 0 && y < grid.height && y >= 0; y += incrementY)
           {
               Tile tile = GetCell(new Vector2Int(x, y));

               if (tile != null)
               {
                   MoveTile(tile, direction);
               }
           }
       }
   }
  
    

}
