//document.currentScript.OBJ_DES[script.url_filename_limpio(document.currentScript.src)] = "jiji";
//============================
//CREADO VIA  cargar_script();
//=============================
document.currentScript.class =

{

    
       LOAD:
       {
              id: 6,
              canvas_id: 1,
              modo: 'sprite',

              animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },

                     { remove_on_loop: 0, ll: 5, wt:32,ht:16, buf: [[0, 13]] },
                     { remove_on_loop: 0, ll: 5, wt:16,ht:32, buf: [[2, 7,]] },
                     { remove_on_loop: 0, ll: 5, wt:16,ht:16, buf: [[0, 15]] },
                     { remove_on_loop: 0, ll: 5, wt:16,ht:16, buf: [[1, 15]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },

                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },
                     { remove_on_loop: 0, ll: 5, wt:32,ht:32, buf: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]] },

                     //20 sucubo
                     { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 0], [0, 1]] },
                     //21 playin
                     { remove_on_loop: 0, ll: 20, wt:32,ht:32,flip:[1,0], buf: [[1,0]] },

              ),
       },
       anim_id:0,
       xvelocity:0,
       yvelocity:0,
       delete_on_out:1,

       loadframe() {

       this.animdata.set_anim(this.anim_id);




       if(this.modos[this.anim_id]!==undefined)
       {
          this.modos[this.anim_id].clip=this;
          this.modos[this.anim_id].load();
          if(this.modos[this.anim_id].is_enem)
          {
              game.enems.push(this);
              this.on_remove=function()
              {
               for(var i=0;i< game.enems.length;i++)
               {
                     let u = game.enems[i];
                 if(u==this)
                 {
                   game.enems.splice(i,1);
                    break;
                 }
               }

              }
          }
        
          
       }

       },

       //|modos
       modos:
       {
         20: //|sucubo
          {
              tt:[0,0,0],
              is_enem:1,
              clip:'',
              macroestado:0,
              hit_score:10,
              hit_sound:6,
              polvo_tt:[0,10],
              volar_hit:1,

            load()
              {
                  this.tt=[rand_bet_(0,50),rand_bet_(20,100),   rand_bet_(0,1)];
              },
              run()
              {
               let _clip = this.clip; 
               let _tt = this.tt;

               _clip.rotation=-0.1+_clip.yvelocity/10;
               _clip.rotation_c=[16,16];

               this.polvo_tt[0]++;
               if(this.polvo_tt[0]>=this.polvo_tt[1])
               {
                this.polvo_tt[0]=0;
                GES.crear_vacio($root.level, 1,{x:_clip.x+_clip.w, y:_clip.y+_clip.h/2, w: 2, h: 2, tt:[0,30],
                                                          draw_color:'rgba(0,0,0,0.5)',
                                              enterframe(){
                                                this.tt[0]++;
                                                   if(this.tt[0]>=this.tt[1])
                                                      {
                                                      this.tt[0]=0;
                                                      this.remove();
                                                     }

                                              }

                                                        })
               }

               if(this.macroestado==0)
               {
               _clip.x--;
               _tt[0]++;
               if(_tt[0]>=_tt[1])
               {
                     _tt[0]=0;
                     _tt[2]=flipbin(_tt[2]);
               }

                if(_tt[2]==0)
                {
                _clip.yvelocity -=0.05;     
                  if(_clip.yvelocity<-1)
                     _clip.yvelocity=-1;

                }

                if(_tt[2]==1)
                {
                _clip.yvelocity +=0.05;     
                  if(_clip.yvelocity>1)
                     _clip.yvelocity=1;
              
                }
               }

               if(this.macroestado==1)
               {
                     
               }   
                


              },
              on_playerhit()
              {
                if(this.macroestado==0)
                {
                 this.clip.remove();
                 game.escenario.act.girlcon.set('sucubo');
                }
              },
              on_weapon_hit()
              {

              
                
               
              }
          },//sucubo,

          21: //|blondie
          {
            is_enem:1,
            clip:'',
            macroestado:0,
            hit_score:10,
            volar_hit:1,
            hit_sound:6,

            load()
              {
                let _tilemap = GES.tileges.tilemaps[1];
                let _clip = this.clip;
                for(var i=0;i<30;i++)
                {
                   if(_tilemap[i]&&_tilemap[i][fl(_clip.x/16) ]>0)
                   {
                    //_clip.draw_color='blue';
                    _clip.y=i*16-32;
                    return;
                   }
                }
                 _clip.y=500;
              },
              run()
              {
               let _clip = this.clip; 

               
               if(this.macroestado==0)
               {

               }

               if(this.macroestado==1)
               {
                     
               }   
                


              },
              on_playerhit()
              {
                if(this.macroestado==0)
                {
                 this.clip.remove();
                 game.escenario.act.girlcon.set('blondie');
                }
              },
              on_weapon_hit()
              {
                if(this.macroestado==0)
                {                
                this.macroestado=1;
                }
                
               
              }
          },//21blondie

          
       },
       on_weapon_hit()
       {
           if(this.modos[this.anim_id]!==undefined)
           {
              let _modo = this.modos[this.anim_id];
              if(_modo.hit_sound!==undefined)
              {
               

                game.playcon.play(_modo.hit_sound);
                _modo.hit_sound=undefined;
              }
              if(_modo.volar_hit)
              {

                  if(_modo.macroestado==0)
                    {                
                    _modo.macroestado=1;
                    if($root.level.jugador.x+$root.level.jugador.w/2<_modo.clip.x+_modo.clip.w/2)
                    _modo.clip.xvelocity=4;     
                    else
                    _modo.clip.xvelocity=-4;     

                    _modo.clip.yvelocity=($root.level.jugador.yvelocity/2)*2;

                    this.rotation=-0.1+this.yvelocity/10;
                    this.rotation_c=[16,16];
                    }
              }


              _modo.on_weapon_hit();
           }
       },

       enterframe() {
        let _level = $root.level;
        let _jugador = $root.level.jugador;
        this.x = this.x + this.xvelocity;
        this.y = this.y + this.yvelocity;

        

        

       if(this.modos[this.anim_id]!==undefined)
         this.modos[this.anim_id].run();


        if(simple_hit_test(this,_jugador) && game.escenario.act.muerto==0)
        {
          if(this.modos[this.anim_id]!==undefined)
          {
            this.modos[this.anim_id].on_playerhit();

          }
        }

         if(this.delete_on_out==1&&
            (this.x<_level.x*-1-50 || this.x>_level.x*-1+game.wcanvas+50||
            this.y<_level.y*-1-50  || this.y>_level.y*-1+game.hcanvas+50))
         {
              //console.log('enem removed');
              this.remove();

         }



       },

}

