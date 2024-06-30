//document.currentScript.OBJ_DES[script.url_filename_limpio(document.currentScript.src)] = "jiji";
//============================
//CREADO VIA  cargar_script();
//=============================
document.currentScript.class ={

       LOAD:
       {
              id: 6,
              canvas_id: 1,
              modo: 'sprite',

              animdata: GAME.crear_animdata(
                     { master: { wt: 16, ht: 16, ll: 30 } },

                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[1, 1,]] },//sosten metalico
                     { remove_on_loop: 0, ll: 5, wt:16,ht:16, buf: [[0, 3]] }, //calzon
                     { remove_on_loop: 0, ll: 5, wt:16,ht:16, buf: [[1, 3]] }, //cubremilkers
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },

                     { remove_on_loop: 0, ll: 5, wt:16,ht:16, buf: [[0, 4]] },//10 calzon verde
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 1]] },

                     //ataques
                     { remove_on_loop: 0, ll: 1, wt:16,ht:16, buf: [[10, 0],[10, 1]] },//fireball



                     ),
       },
       anim_id:0,
       xvelocity:0,
       yvelocity:0,

       loadframe() {
       this.x_ini = this.x;
       this.y_ini = this.y;
       this.animdata.set_anim(this.anim_id);
       if(this._loadframe!==undefined)this._loadframe();

       },


       enterframe() {
        let _level = $root.level;
        let _jugador = $root.level.jugador;
        if(this._enterframe!==undefined)this._enterframe();
        this.x = this.x + this.xvelocity;
        this.y = this.y + this.yvelocity;

        if(
           this.padre==_level&&
           
          (this.x< -_level.x || this.x> -_level.x +_level.w||
           this.y< -_level.y || this.y> -_level.y +_level.h
           ))
          
        {
          this.remove();
        }


       },

}

