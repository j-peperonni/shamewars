//document.currentScript.OBJ_DES[script.url_filename_limpio(document.currentScript.src)] = "jiji";
//============================
//CREADO VIA  cargar_script();
//=============================
document.currentScript.class =
{

    
    LOAD:
    {
       modo: 'vacio',
       canvas_id: 1,
         child: [
              {
               LOAD:
               {
              id: 3,
              canvas_id: 1,
              modo: 'sprite',

              animdata: GAME.crear_animdata({ 
                     master: { offset:[-16,-16],wt: 64, ht: 32+16, ll: 30 } },
                     //master: { offset:[0,0],wt: 64, ht: 32+16, ll: 30 } },

                     { ll: 5, flip:[0,0], buf: [ [0, 0] ] },
                   
                     { ll: 6, flip:[0,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },
                   
                     { ll: 5, flip:[0,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },
                   
                     //saltosuba
                     { ll: 5, flip:[0,0], buf: [ [0, 6] ] },
                   
                     //saltobaja
                     { ll: 5, flip:[0,0], buf: [ [0, 7] ] },
                   
                     //ataque
                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] }, //5

                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },        //10
                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },        //10
                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },        //10
                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },        //10
                     

                     //anims hit
                     //10 empelotada 
                     { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [3, 0] ] },
                     //electrocutada
                     { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [3, 1] ] },
                     //culopinchada
                     { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [3, 2] ] },
                   
                  

              ),
               }
              }
            ]
       },


       xvelocity:0,
       yvelocity:0,
       macroestado:'normal',
       estado_h:0,
       estado:0,
       orien:0,       
       
       w:10,
       h:32,
       _z:10,
       suelo_tt:0,
       salto_tt:0,
       draw_color: '',

       vel:
       {
          x_ini:0.2,
          x_max:2,

          y_max:5,
          grav:0.2,
          //y_salto:4,
          y_salto:5,
       },


       crear_texto(_arr = [["MI POTO"
                            
                            ],
                           // "ESTOY PELADITA", "ESTOY DESNUDA", "ESTOY DESNUDITA",
                           // "MI CALZON?", "NO ME VEAS AHI !", "SE ME VE?" 

                            ["MY VAGINEE", "MY PUSSY", "I AM NAKED"]
                          ], f_data={})
       {

               

                let _r = rand_bet_(0, _arr[0].length-1);
                    _r = [_arr[0][_r],_arr[1][_r]];


               let _texto = crear_texto(this, {
                                                ...{canvas_id:2, 
                                                    x:-5, 
                                                    y:-20, 
                                                    texto:_r, 
                                                    enterframe()
                                                    {
                                                      //this.w++;
                                                      //this.h++;
                                                    this.x=-this.w/2;
                                                    
                                                      if(this.padre.x+this.x<$root.level.x*-1)
                                                      this.x -= (this.padre.x+this.x)-($root.level.x*-1);
                                                      
                                                  
                                                     },
                                                      _onload()
                                                      {   

                                                      this.enterframe();        

                                                      },

                                                      },
                                                      ...f_data
                                                      }

                                                      , 
                                                      'opciones'
                                                      //'opciones_simple'

                                                      );



       },

       //|hitcon
       hitcon:
       {
         hits:[0,2],
         estado:0,
         tt:[0,6,  0,9],
         //|kill_modos
         kill_modos:
         {
           empelotada:
           {

            choritocam_id:{
                           hit: [ [0,0],[0,1],[0,0] ],
                           kill:[ [0,3],[0,3],[0,3] ]
                           },
            hit:
            {
              
              anim_id:10,
            },

            animdata: GAME.crear_animdata( { master: { offset:[-16,-16],wt: 64, ht: 32+16, ll: 30 } },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [5, 0] ] },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 0] ] },
                                          ),

            loadframe(_jugador)
            {
            
            let _p = [[5,5],[-5,5]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:2, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//calzoncito
                _p = [[-8,-10],[-8,-10]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:3, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//sosten

             _jugador.yvelocity=-3;                
            },
            enterframe(_jugador)
            {
               _jugador.yvelocity+=0.1;
               //_jugador.anim.animdata.force.flip=[1,0];
               if(_jugador.yvelocity<0.5)
                _jugador.estado_h=0;
              else
              {
                if(this.foo!==1)
                {
                _jugador.crear_texto([['NO VEAS!', 'MI CHORITO', 'MI CHORO', 'MI SAPITO'],
                                      ["Don t see me", 'My pussy', 'Pervert', 'What are you staring at?'] ]);  
                this.foo=1;
                }
                _jugador.estado_h=1;
              }
                
               if(_jugador.y>game.hcanvas+500)
               {
                   game.escenario.act.on_muerto();
               }
            },
           },//end empelotada
           aplastada:
           {
                        choritocam_id:{
                           hit: [ [0,0],[0,0],[0,0] ],
                           kill:[ [0,1],[0,2],[0,3] ]
                           },
            hit:
            {
              anim_id:12,
            },
            animdata: GAME.crear_animdata( { master: { offset:[-16,-16],wt: 64, ht: 32+16, ll: 30 } },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 4] ] },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 5] ] },
                                          ),

            loadframe(_jugador)
            {
            _jugador.crear_texto([['ME APRETA EL POTO', 'AU, MI POTITO'],['MY ASS HURT'] ],{y:-30});
            let _p = [[5,5],[-5,5]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:2, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//calzoncito
                _p = [[-8,-10],[-8,-10]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:3, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//sosten

             _jugador.yvelocity=-3;                
             _jugador.anim.animdata.force.flip=[_jugador.orien,0];
            },
            enterframe(_jugador)
            {
               _jugador.yvelocity+=0.1;
               if(_jugador.yvelocity<0.5)
                _jugador.estado_h=0;
              else
                _jugador.estado_h=1;
               if(_jugador.y>game.hcanvas+500)
               {
                   game.escenario.act.on_muerto();
               }
            },
           },//end aplastada

           clavada:
           {
                        choritocam_id:{
                           hit: [ [0,0],[0,0],[0,0] ],
                           kill:[ [0,1],[0,2],[0,3] ]
                           },
            hit:
            {
              anim_id:12,
            },
            animdata: GAME.crear_animdata( { master: { offset:[-16,-16],wt: 64, ht: 32+16, ll: 30 } },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 4] ] },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 5] ] },
                                          ),

            loadframe(_jugador)
            {
            _jugador.crear_texto([['ME PICO EL POTO', 'AU, MI POTITO'],['MY BUTT','MY BUTT'] ],{y:-30});
            let _p = [[5,5],[-5,5]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:2, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//calzoncito
                _p = [[-8,-10],[-8,-10]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:3, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//sosten

             _jugador.yvelocity=-3;                
             _jugador.anim.animdata.force.flip=[_jugador.orien,0];
            },
            enterframe(_jugador)
            {
               _jugador.yvelocity+=0.1;
               if(_jugador.yvelocity<0.5)
                _jugador.estado_h=0;
              else
                _jugador.estado_h=1;
               if(_jugador.y>game.hcanvas+500)
               {
                   game.escenario.act.on_muerto();
               }
            },
           },//end clavada

           electrocutada:
           {
                        choritocam_id:{
                           hit: [ [0,0],[0,0],[0,0] ],
                           kill:[ [0,3],[0,3],[0,3] ]
                           },
            hit:
            {
              anim_id:11,
            },
            animdata: GAME.crear_animdata( { master: { offset:[-16,-16],wt: 64, ht: 32+16, ll: 30 } },
                                           { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [5, 1] ] },
                                          ),

            loadframe(_jugador)
            {
            _jugador.crear_texto([['AUCH'],['AUCH'] ], {y:-30});
            let _p = [[5,5],[-5,5]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:2, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//calzoncito
                _p = [[-8,-10],[-8,-10]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:3, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//sosten

             _jugador.yvelocity=-3;                
             _jugador.anim.animdata.force.flip=[1,0];
            },
            enterframe(_jugador)
            {
                _jugador.anim.rotation+=0.1;
                _jugador.anim.rotation_c=[_jugador.anim.w/2,_jugador.anim.h/2];
               _jugador.yvelocity+=0.1;
               if(_jugador.y>game.hcanvas+500)
               {
                    game.escenario.act.on_muerto();
               }
            },
           },//end electrocutada

         },//end kill_modos
         kill(f_modo = 'empelotada')
         {
          let _jugador   = $root.level.jugador;
          let _level     = $root.level;
          let _kill_modo = this.kill_modos[f_modo];
          let _choritocam_id = _kill_modo.choritocam_id;
          game.choritocam.crear( random_from_array(_choritocam_id.kill), 'jugador');
          this.estado=-1;
          this.hits[0]=this.hits[1];
          game.playcon.play(11);
          
           _jugador.xvelocity=0;             
           _jugador.yvelocity=0;             

           _jugador.anim.visible = true;
           _jugador.anim.animdata = _kill_modo.animdata;
           _jugador.anim.animdata.set_anim(0);
           _jugador.estado_h = 0;

           _jugador.kill_modo_act = _kill_modo;
           _kill_modo.loadframe(_jugador);


            _jugador.macroestado='muerto';

         },
         run()
         {
           let _tt = this.tt;
           let _jugador = $root.level.jugador;
            if(this.estado==1)
            {
              
               _tt[0]++;
               if(_tt[0]>=_tt[1])
               {
                _tt[0]=0;
                if(_jugador.macroestado!=='hit')
                _tt[2]++;
                _jugador.anim.visible = swap_bin(_jugador.anim.visible);
                if(_tt[2]>_tt[3])
                {       
                  _tt[2]=0;
                  _jugador.anim.visible = 1;
                  this.estado=0;
                }

               }

            }

         },
         hit(f_modo='empelotada')
         {
          if(this.estado==0)
          {

            this.estado=1;
            let _jugador = $root.level.jugador;
            

            let _kill_modo = this.kill_modos[f_modo];

             let _choritocam_id = _kill_modo.choritocam_id;
             

            this.hits[0]++;
            if(this.hits[0]<this.hits[1])
            {
              game.choritocam.crear( random_from_array(_choritocam_id.hit), 'jugador');

              game.playcon.play(9);
            let _p = [[-8,-5],[-8,-5]]; 
                _p = _p[$root.level.jugador.orien];

            crear_particula($root.level, {anim_id:1, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//armadura
            _p = [[0,3],[-3,3]]; _p = _p[$root.level.jugador.orien];
            
            }

            _jugador.macroestado='hit';
            _jugador.yvelocity=-2.5;
            _jugador.estado_h=_kill_modo.hit.anim_id;
            
            
            if(this.hits[0]==this.hits[1])
            {

             this.kill(f_modo);
             return(1);

            }
          }

         },

       },

       
       double_check(f_id, f_dir=0) //solucion workaround
       {
        let _a;
        let _b;
        if(f_dir==0)//arr
        {
        _a = this.tilecheck(this.x+1,       this.y-2);
        _b = this.tilecheck(this.x+this.w-1,this.y-2); 
        }        
        if(f_dir==1)//aba
        {
        _a = this.tilecheck(this.x+1,       this.y+this.h+2);
        _b = this.tilecheck(this.x+this.w-1,this.y+this.h+2);
        }

        if(_a==f_id&&_b==f_id || _a == f_id && _b==0||_a==0&&_b==f_id)
          return(1)

        return(0);

       },

       tilecheck(_x, _y)
       {
        let _tilemap = GES.tileges.tilemaps[1];

           if(_tilemap[fl(_y/16)])
           return (_tilemap[fl(_y/16)][fl(_x/16)])

         return(0);
            
       },
       

       

       loadframe() {

        this.anim = this.hijos_clip[0];
        this.estado=1;



       },

       

       enterframe() {

            let _teclado = game.win.teclado;
            let _vel = this.vel;
            let _level = $root.level;
            let _editmode = game.levelcon.editmode;
            let _tilemaps = GES.tileges.tilemaps;


            this.xprev = this.x;
            this.yprev = this.y;

              

            this.x = this.x + this.xvelocity;
            this.y = this.y + this.yvelocity;

            this.hitcon.run();



              

           if(this.macroestado=='hit')
           {
             let _col = col_check(this); 
             if(_col[1])
              this.macroestado='normal';

            this.yvelocity+= _vel.grav/2;

            if(_teclado.get('izq'))
            {
              this.xvelocity-=0.3;
              if(this.xvelocity<-2)
                this.xvelocity=-2;
            }

            if(_teclado.get('der'))
            {
              this.xvelocity+=0.3;
              if(this.xvelocity>2)
                this.xvelocity=2;
            }
            if(!_teclado.get('izq')&&!_teclado.get('der'))
            {
              this.xvelocity+= (0-this.xvelocity)/20;
            }

            if(this.x<=_level.x*-1)
              {
                this.x=_level.x*-1;
                if(this.xvelocity<=0)
                this.xvelocity=0.01;
              }

             if(this.x+this.w> _level.x*-1 +($tileges.xt_max) * 16)
              {
               this.x=_level.x*-1+($tileges.xt_max)* 16-this.w;      
               this.xvelocity=0;
              }
              if(this.y-8>game.hcanvas)
              {
                this.hitcon.kill('empelotada');
                return;
              }


           }

            if(this.macroestado=='normal')
            {
              if(this.x<=_level.x*-1)
              {
                this.x=_level.x*-1;
                if(this.xvelocity<=0)
                this.xvelocity=0.01;
              }
              


                let _col = col_check(this);
                if(_col[0]&&this.x<=_level.x*-1+1)
                {
                  this.hitcon.kill('aplastada');
                  this.xvelocity=0.2;
                  return;
                //game.escenario.set('play_0');
                }


              if(_col[1])
              {
               
                this.suelo_tt=5;

                  if(_col[1].id==90 && this.double_check(90,1))
                  {
                  if(this.hitcon.hit());
                    return; 
                  }
                
              }
              if(_col[3])
              {
                if(_col[1].id==91)
                {
                  if(this.hitcon.hit());
                  return;
                }
              }
              
              

              if(this.suelo_tt>0)
              this.suelo_tt--;
              

             
              this.yvelocity+= _vel.grav;
             

              if(this.yvelocity>_vel.y_max)
                 this.yvelocity = _vel.y_max;
             
             if(this.estado==0||this.estado==1 || _teclado.get('x')!==0 && this.suelo_tt>0)
             {
              this.xvelocity+= (0-this.xvelocity)/10;
              
              if(_teclado.get('izq'))
                     this.estado=2;
              if(_teclado.get('der'))
                     this.estado=3;
              

             }
             else if(this.estado==2)
             {
              this.xvelocity -=_vel.x_ini;
              if(this.xvelocity < -_vel.x_max)
                this.xvelocity=-_vel.x_max;

              if(_teclado.get('izq')==0)
               this.estado=0;
             }
             else if(this.estado==3)
             {
              this.xvelocity +=_vel.x_ini;
              if(this.xvelocity > _vel.x_max)
                this.xvelocity=_vel.x_max;

              if(_teclado.get('der')==0)
               this.estado=1;
             }


             //salto
             if(_teclado.get('z'))
             {
               if(this.suelo_tt>0 && this.salto_tt==0)
               {
                game.playcon.play(0,0.6);
                this.salto_tt=1;
                  this.yvelocity-=_vel.y_salto;
                  this.suelo_tt=0;
               }

             }
             if(_teclado.get('z')==0&&this.salto_tt==1)
             {
              this.yvelocity/=1.6;
              this.salto_tt=0;

             }
               
              if(this.x+this.w> _level.x*-1 +($tileges.xt_max) * 16)
              {
               this.x=_level.x*-1+($tileges.xt_max)* 16-this.w;      
               this.xvelocity=0;
              }
               
              if(_editmode==1&& this.y+this.h>game.hcanvas)
              {
                this.y=game.hcanvas-this.h;
                this.salto_tt=0;
                this.yvelocity=0;
                this.suelo_tt=5;
              }

              if(this.y-8>game.hcanvas)
              {
                this.hitcon.kill('empelotada');
                return;
              }
            
            
            if(_editmode==0)
            {
             let _a = 0;
                for(var u of _col[4])
                {
                    if(u!==0)
                    {
                      if(u.id==88)
                      {
                      _tilemaps[1][u.yt][u.xt]=0;
                       _a=u;
                      }
                    }
                }
                if(_a!==0)
                {
                  game.playcon.play(12, 0.5);

                  GES.tileges.refresh.force();
                  crear_efecto_16($root, {anim_id:21, x:u.x+_level.x, y: u.y+_level.y,
                                  _enterframe()
                                  {
                                    this.x+=(0-this.x)/10;
                                    this.y+=(0-this.y)/10;
                                    if(this.x<5)
                                    {
                                      game.escenario.act.hud.update_score(10, '+');   
                                      this.remove();
                                    }
                                  }
                                 });//calzoncito
                }

          
          
              
            }

             

             

             if(_teclado.get('s',2)==1)
             {
              if(this.hitcon.hit())
                 return;
             }

             if(_teclado.get('t',2)==1)
             {
               let _tiledata = $gameges.tileges.tiledata.col;
               for(var i =1;i<(6*10)*5;i++)
               {
                _tiledata[i]=[1,1,1,1];
               }
             }

             if(_editmode==0&& _teclado.get('space',2)==1)
             {

              this.hitcon.kill('empelotada');
              if(_teclado.get('q'))
                this.yvelocity=30;
              return;
              
             }
             

             
              for(var u of game.enemcon.clips)
              {
                  if(simple_hit_test(this,u))
                  {
                    if(u.on_player_hit!==undefined && game.escenario.act.muerto==0)
                       u.on_player_hit();
                  }
             }
             //workaround muerte al chekear enemigos
             if(this.macroestado=='muerto'||this.macroestado=='hit')return;



             
             if(this.estado==0||this.estado==1)
              this.estado_h=0;

             if(this.estado==2||this.estado==3)
              this.estado_h=1;


              if(this.suelo_tt==0)
              {
                if(this.yvelocity<1)
                   this.estado_h=3;  
                
                if(this.yvelocity>=1)
                 this.estado_h=4;  
                
              }

              if(_teclado.get('x'))
              {

                this.estado_h=5;

                if(_teclado.get('x',2)==1)
                {
                  game.playcon.play(3, 0.5);

                  let _xp = 0;
                  if(this.orien==0)_xp=-10;
                let _shoot = GES.crear_vacio($root.level, 1,{x:this.x+_xp, y:this.y+12, w: 16, h: 10, 
                                                          draw_color:'', orien:this.orien,tt:0,xvelocity:0,yvelocity:0,
                        enterframe()
                        {

                         for(var u of game.enemcon.clips)
                         {
                           if(simple_hit_test(this,u))
                           {
                            
                            if(u.hit!==undefined && u.hit[0]>0)
                            {
                              u.hit[0]--;
                              if(u.hit[0]<=0)
                              {
                                game.playcon.play(9, 5);
                                if(u.es_ropa&&u.padre.ropas_n>0)u.padre.ropas_n--;
                                if(u.on_destroy!==undefined) u.on_destroy();
                                u.remove();
                              }
                                
                                game.fadecon.blink_clip(u);
                              
                                game.playcon.play(u.hit[2], 0.3);

                                game.crear_texto_flotante($root.level, {fuente:'opciones',x:u.x+u.padre.x, y:u.y+u.padre.y, texto: u.hit[1] })  
                                game.escenario.act.hud.update_score(u.hit[1], '+');  
                                this.remove();
                                  if(u.on_weapon_hit!==undefined)u.on_weapon_hit();
                                break;


                            }

                            if(u.on_weapon_hit!==undefined)u.on_weapon_hit();

                            //u.remove();
                           }
                         }
                         
                         


                          if(this.orien)
                          this.x+=2;
                        else
                          this.x-=2;

                          this.tt++;
                          if(this.tt>10)
                            this.remove();
                          this.yvelocity=$root.level.jugador.yvelocity;
                          this.xvelocity=$root.level.jugador.xvelocity;
           
                         this.x = this.x + this.xvelocity;
                         this.y = this.y + this.yvelocity;

                        }

                   });
                }
              }

            }//macroestado

            if(this.macroestado=='muerto')
            {
              game.escenario.act.muerto=1;

              this.kill_modo_act.enterframe(this);
              
              
            }

            if(_teclado.get('r',2)==1)
             {
              game.escenario.set('play_0');
             }

             
            
             for(var u of this.anim.animdata.animations)
             {
              for(var j of u.buf)
              {
                if(u.no_buf_add!==1)
                    j[0]=this.hitcon.hits[0];
              }

             }
             

              
             this.orien=0;
             if(this.estado==1||this.estado==3)
              this.orien=1;

             this.anim._z=10;
             this.anim.animdata.set_anim(this.estado_h);
             //this.anim.x=-11+10;
             this.anim.x=-11;
             this.anim.y=2;

             
             this.anim.animdata.force.flip=[this.orien,0];


            // this.anim.rotation_c=[this.anim.w/2,this.anim.h-10];
             
       },

}

