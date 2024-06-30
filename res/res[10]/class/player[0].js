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
                     { ll: 5, flip:[1,0], buf: [ [0, 0] ] },

                     { ll: 6, flip:[0,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },
                     { ll: 6, flip:[1,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },

                     { ll: 5, flip:[0,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },
                     { ll: 5, flip:[1,0], buf: [ [0, 2],[0, 3],[0, 4],[0, 3], ] },

                     //saltosuba
                     { ll: 5, flip:[0,0], buf: [ [0, 6] ] },
                     { ll: 5, flip:[1,0], buf: [ [0, 6] ] },

                     //saltobaja
                     { ll: 5, flip:[0,0], buf: [ [0, 7] ] },
                     { ll: 5, flip:[1,0], buf: [ [0, 7] ] },

                     //ataque
                     { offset:[-16,-16],ll: 5, loop:1, flip:[0,0],    buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },
                     { offset:[-16,-16   ] ,ll: 5, loop:1, flip:[1,0],  buf: [ [0, 8],[0, 9],[0, 9],[0, 10] ] },

                     //quemado
                     { ll: 5, flip:[0,0], no_buf_add:1, buf: [ [4, 0] ] },

              ),
               }
              }
            ]
       },

       orien:0,       
       xvelocity:0,
       yvelocity:0,
       estado_h:0,
       estado:0,
       w:10,
       h:32,
       _z:10,
       vel:
       {
          x_ini:0.2,
          x_max:2,

          y_max:5,
          grav:0.2,
          //y_salto:4,
          y_salto:5,
       },

       suelo_tt:0,
       salto_tt:0,
       draw_color: '',


       //|hitcon
       hitcon:
       {
         hits:0,
         estado:0,
         tt:[0,6,  0,9],
         kill()
         {
          game.playcon.play(11);
             let _jugador = $root.level.jugador;
           _jugador.xvelocity=0;             
           _jugador.yvelocity=0;             
             $root.level.jugador.quemar();
             this.estado=-1;
           _jugador.anim.visible = true;
           

            let _p = [[5,5],[-5,5]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:2, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//calzoncito
                _p = [[-8,-10],[-8,-10]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:3, grav:0.03, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//sosten
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
                _tt[2]++;
                _jugador.anim.visible = swap_bin(_jugador.anim.visible);
                if(_tt[2]>_tt[3])
                {

                  
                  _tt[2]=0;
                  this.estado=0;
                }

               }


            }

         },
         hit()
         {
          if(this.estado==0)
          {
            this.estado=1;
            let _jugador = $root.level.jugador;


            

            if(this.hits==0)
            {
              game.playcon.play(9);
            let _p = [[-8,-13],[-8,-13]]; _p = _p[$root.level.jugador.orien];
            crear_particula($root.level, {anim_id:0, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//casco
            _p = [[0,3],[-3,3]]; _p = _p[$root.level.jugador.orien];
            
            crear_particula($root.level, {anim_id:1, x:_jugador.x+_p[0], y: _jugador.y+_p[1]});//capa
            }
            

            this.hits++;
            if(this.hits==2)
            {
             this.kill();
             return(1);

            }
          }

         },

       },

       //|scrollcon
       scrollcon:
       {
          tt_score:[0,3],
          xt:-10,
          run(f_ini=0)
          {

             let _tilemaps = GES.tileges.tilemaps;

            
             this.xt=fl($root.level.x/16);

           
           
             $root.level.x -= 1;

             GES.tileges.x=$root.level.x*-1;
             GES.tileges.y=$root.level.y*-1;

             GES.fondoges.fondos[0].x = $root.level.x/8;
             GES.fondoges.fondos[1].x = $root.level.x/1.8;

             //GES.fondoges.fondos[1].x = $root.level.x*1.5;
             
           //  if($root.level.x>0)$root.level.x=0;
           //  if ((-$root.level.x) + $tileges.xt_max * 16 > $tileges.xt_allmax * 16) 
           //  $root.level.x = -($tileges.xt_allmax * 16 - $tileges.xt_max * 16);

             /*$root.level.y = this.y*-1+game.hcanvas/2;
             if($root.level.y>0)$root.level.y=0;
              if ((-$root.level.y) + ($tileges.yt_max) * 16 > $tileges.yt_allmax * 16) 
              $root.level.y = -($tileges.yt_allmax * 16 - ($tileges.yt_max) * 16);
            */
            
            if(this.xt!=fl($root.level.x/16))
            {
              if(f_ini==0)
              {
                this.tt_score[0]++;
                if(this.tt_score[0]==this.tt_score[1])
                {
                  this.tt_score[0]=0;
                game.escenario.act.hud.update_score(10, '+');  
                }
                
              }

              for(var k=0;k<_tilemaps.length;k++)
              {
                let _tilemap = _tilemaps[k];
                
                   for(var i =0;i<_tilemap.length;i++)
                   {
                      if(k==1 && i>8 && (i!==13||i==13&&_tilemap[i-1][_tilemap[0].length-1]!==0) )
                       {
                        if(f_ini)
                          _tilemap[i].push(1); 
                        else
                       _tilemap[i].push(rd(Math.random()) ); 
                       }
                       else
                       _tilemap[i].push(0);
                   }

              }  
              GES.tileges.update_allmax();




                //cargar enemigo
                let _r =rd(Math.random()*10);
                if(f_ini==0&&_r==5)
                {
                let _enem = GES.cargar_clase($root.level, 3,{anim_id:20, x: $root.level.x*-1+game.wcanvas ,y:4*16});
                }
              
             

              for(var k=0;k<_tilemaps.length;k++)
              {
                let _tilemap = _tilemaps[k];
                for(var i =0;i<_tilemap.length;i++)
                {
                  if(k==1)
                  {
                      if(_tilemap[i][_tilemap[i].length-1-1]==1)
                      {
                         let _c = check(i,1);

                           //misc
                                 
                            if(f_ini!==1)
                            {  
                            if(!_c[1] && Math.random()<0.5)
                             _tilemap[i-1][_tilemap[i].length-1-1]=90;

                             if(!_c[3] && Math.random()<0.5)
                             _tilemap[i+1][_tilemap[i].length-1-1]=91;
                            }

                          
                                 //MISC

                          
                   

                          if(!_c[0]&&!_c[1]&&!_c[2]&&!_c[3])
                          _tilemap[i][_tilemap[i].length-1-1]=43;
                        
                          if(_c[0]&&_c[1]&&_c[2]&&_c[3])
                          {
                          _tilemap[i][_tilemap[i].length-1-1]=12;

                          //   _____ 
                          //  |_/   |
                          //  |     |
                          //  |_____|
                          if(!_c[4])
                           _tilemap[i][_tilemap[i].length-1-1]=16;

                          //   _____ 
                          //  |   |_|
                          //  |     |
                          //  |_____|
                          if(!_c[5])
                           _tilemap[i][_tilemap[i].length-1-1]=17;

                          //   _____ 
                          //  |     |
                          //  |    _|
                          //  |___|_|
                          if(!_c[6])
                           _tilemap[i][_tilemap[i].length-1-1]=27;


                          //   _____ 
                          //  |     |
                          //  |_    |
                          //  |_|___|
                          if(!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=26;

                          //   _____ 
                          //  |_| |_|
                          //  |     |
                          //  |_____|
                          if(!_c[4]&&!_c[5]   &&_c[6]&&_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=46;

                          //   _____ 
                          //  |     |
                          //  |_   _|
                          //  |_|_|_|
                          if(!_c[6]&&!_c[7]  &&_c[4]&&_c[5])
                           _tilemap[i][_tilemap[i].length-1-1]=56;

                          
                          //   _____ 
                          //  |   |_|
                          //  |    _|
                          //  |_ _|_|
                          if(!_c[5]&&!_c[6]  &&_c[4]&&_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=49;

                          //   _____ 
                          //  |_|   |
                          //  |_    |
                          //  |_| __|
                          if(!_c[4]&&!_c[7]  &&_c[5]&&_c[6])
                           _tilemap[i][_tilemap[i].length-1-1]=48;                         

                          //   _____ 
                          //  |_| |_|
                          //  |_   _|
                          //  |_| |_|
                          if(!_c[4]&&!_c[5]&&!_c[6]&&!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=18;                         


                          //   _____ 
                          //  |   |_|
                          //  |_    |
                          //  |_|   |
                          if( _c[4]&&!_c[5]&& _c[6]&&!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=29;                         

                          //   _____ 
                          //  |_|   |
                          //  |    _|
                          //  |   | |
                          if(!_c[4]&&_c[5]&& !_c[6]&&_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=38;                                                  


                          //   _____ 
                          //  |   |_|
                          //  |_   _|
                          //  | | | |
                          if( _c[4]&&!_c[5]&& !_c[6]&&!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=5;

                          //   _____ 
                          //  |_|   |
                          //  |_   _|
                          //  | | | |
                          if(!_c[4]&&_c[5]&& !_c[6]&&!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=15;

                          //   _____ 
                          //  |_| |_|
                          //  |_    |
                          //  | |   |
                          if(!_c[4]&&!_c[5]&& _c[6]&&!_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=25;

                          //   _____ 
                          //  |_| |_|
                          //  |    _|
                          //  |   | |
                          if(!_c[4]&&!_c[5]&& !_c[6]&&_c[7])
                           _tilemap[i][_tilemap[i].length-1-1]=35;                         



                          }                          


                          //<
                          if(!_c[0]&&!_c[1]&&_c[2]&&!_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=31;

                          //=
                          if(_c[0]&&!_c[1]&&_c[2]&&!_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=32;

                          //>
                          if(_c[0]&&!_c[1]&&!_c[2]&&!_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=33;


                          //¡
                          if(!_c[0]&&!_c[1]&&!_c[2]&&_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=34;

                          //|
                          if(!_c[0]&&_c[1]&&!_c[2]&&_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=44;

                          //!
                          if(!_c[0]&&_c[1]&&!_c[2]&&!_c[3])
                           _tilemap[i][_tilemap[i].length-1-1]=54;


                          //____
                          //|
                          if(!_c[0]&&!_c[1]&&_c[2]&&_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=1;
                             if(!_c[6])
                             _tilemap[i][_tilemap[i].length-1-1]=8;
                          }


                          //____
                          //
                          if(_c[0]&&!_c[1]&&_c[2]&&_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=2;
                         
                           if(!_c[6])
                            _tilemap[i][_tilemap[i].length-1-1]=42;
                          if(!_c[7])
                            _tilemap[i][_tilemap[i].length-1-1]=41;
                          if(!_c[6]&&!_c[7])
                            _tilemap[i][_tilemap[i].length-1-1]=40;

                          }

                          //____
                          //    |
                          if(_c[0]&&!_c[1]&&!_c[2]&&_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=3;
                             if(!_c[7])
                             _tilemap[i][_tilemap[i].length-1-1]=9;
                          }

                          //|
                          //|
                          if(!_c[0]&&_c[1]&&_c[2]&&_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=11;

                           if(!_c[5])
                            _tilemap[i][_tilemap[i].length-1-1]=10;
                           if(!_c[6])
                            _tilemap[i][_tilemap[i].length-1-1]=20;
                          if(!_c[5]&&!_c[6])
                            _tilemap[i][_tilemap[i].length-1-1]=30;

                          }

                          //    |
                          //    |
                          if(_c[0]&&_c[1]&&!_c[2]&&_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=13;

                           if(!_c[4])
                            _tilemap[i][_tilemap[i].length-1-1]=4;
                           if(!_c[7])
                            _tilemap[i][_tilemap[i].length-1-1]=14;
                          if(!_c[4]&&!_c[7])
                            _tilemap[i][_tilemap[i].length-1-1]=24;
                          }

                          //|
                          //|____
                          if(!_c[0]&&_c[1]&&_c[2]&&!_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=21;
                             if(!_c[5])
                              _tilemap[i][_tilemap[i].length-1-1]=6;
                             

                          }

                          //
                          //____
                          if(_c[0]&&_c[1]&&_c[2]&&!_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=22;

                           if(!_c[4])
                            _tilemap[i][_tilemap[i].length-1-1]=51;
                           if(!_c[5])
                            _tilemap[i][_tilemap[i].length-1-1]=52;
                          if(!_c[4]&&!_c[5])
                            _tilemap[i][_tilemap[i].length-1-1]=50;
                          }

                          //    |
                          //____|
                          if(_c[0]&&_c[1]&&!_c[2]&&!_c[3])
                          {
                           _tilemap[i][_tilemap[i].length-1-1]=23;
                             if(!_c[4])
                             _tilemap[i][_tilemap[i].length-1-1]=7;
                          }



                          

                          
                        }          
                   
                  }
                }

              }    
              GES.tileges.refresh.force();

            }
            


          }

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
       

       quemar()
       {
              
              let _level = $root.level;
              this.macroestado='quemado';
              this.xvelocity=0;
              this.yvelocity=-5;

               let _arr = [["MI CHORO", "MI CHORITO", "ESTOY A POTO PELADO",
                            "MI PAPAYA", "MI CHORIFLAI", "ESTOY PELADITA",
                            "OH, NO ME VEAI", "QUE WEA?", "MI CHURRIN!"
                            ],
                           // "ESTOY PELADITA", "ESTOY DESNUDA", "ESTOY DESNUDITA",
                           // "MI CALZON?", "NO ME VEAS AHI !", "SE ME VE?" 

                            ["MY VAGINEE", "MY PUSSY", "I AM NAKED"]
                          ];

                let _r = rand_bet_(0, _arr[0].length-1);
                    _r = [_arr[0][_r],_arr[1][_r]];

               let _texto = crear_texto(this, {x:-5, y:-20, texto:_r, 
                    _onload(){   
                             this.x=-this.w/2;
                  
                            if(this.padre.x+this.x<$root.level.x*-1)
                              this.x -= (this.padre.x+this.x)-($root.level.x*-1);

                            },

                    }, 'opciones_simple');
                   

                   /*
                   _texto.x=-_texto.w/2;
                  
                  if(this.x+_texto.x<_level.x*-1)
                    _texto.x -= (this.x+_texto.x)-(_level.x*-1);
                  */


                 let _elebig = GES.crear_imagen($root.level, 9,  1, { x: $root.level.x*-1-(16*3), y: 5, w: 16 * 10, h: 16 * 10, visible:false,
                                                               _z:30,
                                                              cut_cords: { x: (16*10)*0, 
                                                                           y: (16*10)*0,
                                                                           w: 16 * 10,
                                                                           h: 16 * 10
                                                                          },
                                           loadframe()
                                           {

                                            
                                             if($root.level.jugador.x<$root.level.x*-1+game.wcanvas/2)
                                             {
                                              
                                              this.x=$root.level.x*-1+game.wcanvas-(16*7)
                                             
                                             }
                                             else
                                             this.x=$root.level.x*-1-(16*3)

                                            this.y= ($root.level.jugador.y-(16*5));
                                           },
                                           enterframe()
                                           {
                                            //this.x+= ($root.level.x*-1);
                                            this.visible=game.win.teclado.get('c');
                                            //this.visible=true;
                                            this.y+= (($root.level.jugador.y-(16*5))-this.y)/20;
                                            
                                           }

                                           ,
                                                                           });
                      //_elebig.enterframe();



       },

       loadframe() {

        this.anim = this.hijos_clip[0];
        this.estado=1;

/*        game.scrollcon.level_start();
        

        this.x+=300;
        GES.fondoges.fondos[0].x = $root.level.x/8;
        GES.fondoges.fondos[1].x = $root.level.x/1.8;

  */      

       },

       macroestado:'normal',

       enterframe() {
              let _teclado = game.win.teclado;
              let _vel = this.vel;
              let _level = $root.level;


              this.xprev = this.x;
              this.yprev = this.y;

              

              this.x = this.x + this.xvelocity;
              this.y = this.y + this.yvelocity;

              this.hitcon.run();
              

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
                  this.hitcon.kill();
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
             
             if(this.estado==0||this.estado==1)
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


              if(this.x<0)
              {
               this.x=0;
               this.xvelocity=0;      
              }
               
              if(this.x+this.w> _level.x*-1 +($tileges.xt_max) * 16)
              {
               this.x=_level.x*-1+($tileges.xt_max)* 16-this.w;      
               this.xvelocity=0;
              }
               

            /*  if(this.y+this.h>game.hcanvas)
              {
                 this.y=game.hcanvas-this.h;
                 this.yvelocity=0;
                 this.suelo_tt=10;
              }
            */
              if(this.y-8>game.hcanvas)
              {
                this.hitcon.kill();
                return;
              }
            

             //control pantalla
//             $root.level.x = this.x*-1+game.wcanvas/2;
           //  if(game.escenario.escenas.play_0.girlcon.estado==0)
           //  {
           //  this.scrollcon.run(); 
           //  }
             
             


             if(_teclado.get('s',2)==1)
             {
              if(this.hitcon.hit())
                 return;
             }

             if(_teclado.get('t',2)==1)
             {
             console.log('dada')
               let _tiledata = $gameges.tileges.tiledata.col;
               for(var i =1;i<(6*10)*5;i++)
               {
                _tiledata[i]=[1,1,1,1];
               }
             }

             if(_teclado.get('space',2)==1)
             {




              this.hitcon.kill();
              if(_teclado.get('q'))
                this.yvelocity=30;
              return;
              
             }
             

             



             this.estado_h = this.estado;     


              if(this.suelo_tt==0)
              {
                if(this.yvelocity<1)
                {
                   this.estado_h=6;  
                   if(this.estado==1||this.estado==3)
                    this.estado_h=7;
                }

                if(this.yvelocity>=1)
                {
                   this.estado_h=8;  
                   if(this.estado==1||this.estado==3)
                    this.estado_h=9;
                }
                
              }

              if(_teclado.get('x'))
              {

                this.estado_h=10;
                if(this.estado==1||this.estado==3)
                  this.estado_h=11;

                if(_teclado.get('x',2)==1)
                {
                  game.playcon.play(3, 0.5);

                  let _xp = 0;
                  if(this.orien==0)_xp=-10;
                let _shoot = GES.crear_vacio($root.level, 1,{x:this.x+_xp, y:this.y+12, w: 16, h: 10, 
                                                          draw_color:'', orien:this.orien,tt:0,xvelocity:0,yvelocity:0,
                        enterframe()
                        {

                         for(var u of game.enems)
                         {
                           if(simple_hit_test(this,u))
                           {

                            if(u.modos[u.anim_id]?.macroestado==0)
                            {
                            game.crear_texto_flotante($root.level, {fuente:'opciones',x:u.x, y:u.y, texto: u.modos[u.anim_id].hit_score})  
                            game.escenario.act.hud.update_score(u.modos[u.anim_id].hit_score, '+');  
                            }
                            
                            
                            u.on_weapon_hit();

                            //u.remove();
                           }
                         }
                         

                         for(var u of game.escenario.escenas.play_0.girlcon.ropas)
                         {
                          if(u.is_ropa!==1)continue;

                           if(simple_hit_test(this,{x:u.x+ u.padre.x,
                                                    y:u.y+ u.padre.y,
                                                    w:u.w,
                                                    h:u.h}))
                           {
                            if(u.sound_id!=='')
                            game.playcon.play(u.sound_id, 0.3);

                            game.crear_texto_flotante($root.level, {fuente:'opciones',x:u.x+u.padre.x, y:u.y+u.padre.y, texto: u.score[0]})  
                            game.escenario.act.hud.update_score(u.score[0], '+');  


                            u.on_hit();
                            this.remove();
                            break;
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

            if(this.macroestado=='quemado')
            {
              game.escenario.act.muerto=1;
              this.estado_h = 12;
              this.yvelocity+=0.1;
              if(this.y>game.hcanvas+500)
              {
                //game.escenario.act.hud.score_a.remove();
                game.escenario.act.hud.score_b.remove();


              let _base = GES.crear_vacio($root, 1,{nombre:'base',x:8, y:8, w: game.wcanvas-16, h: game.hcanvas-16, 
                                                          draw_color:'rgb(0,0,0, 0.8)'});

               let _t;

               let _a = crear_texto(_base, {x:10, y:2, texto: ['TU PUNTAJE:','YOUR SCORE:'] },'opciones')
               let _b = crear_texto(_base, {x:10, y:2, texto: game.escenario.escenas.play_0.hud.score},'opciones')
                   _b.x=_base.w-_b.w-10;


                

               let _c = crear_texto(_base, {x:10, y:20, texto: ['Altas puntuaciones:','High Scores:'] },'opciones')



                if(NGIO.user.name==null)
                {

                  game.scorecon.crear_scores(_base, {i:0, x:[10,_base.w-10], y:40});

                }
                
                else
                {
                  console.log('score posteado!')
                  game.api.post_score(game.escenario.act.hud.score, ()=>{

                   game.scorecon.crear_scores(_base, {i:0, x:[10,_base.w-10],y:40});


                  } );
                }

                    

               if(NGIO.user.name==null)
               {
                  

                  let _login = game.botoncon.crear_boton($root, {x:32, y:150, fuente:'opciones',
                                            texto:['Logueate para subir tu puntaje!','Login to submit your score!'],
                                            _onload()
                                            {
                                            this.xini = this.xg;
                                            this.yini = this.yg;
                                            this.wini = this.w;
                                            this.hini = this.h;

                                            this.w= 200;
                                            this.wini = this.w;
                                            this.x= 8+(game.wcanvas-16)/2-this.w/2;
                                            this.xini=this.x;
                                            //_login.x=_base.x+_base.w/2-_login.w/2;
                                            //_login.xini=_login.x;
                                            },
                                            on_click:()=>{
                                            game.api.cargar_login();
                                            
                                            }
                                           })
                    _login.es_logueate=1;
                    


               }

                
                
                    
                let _rt = game.botoncon.crear_boton($root, {x:32, y:165, fuente:'opciones',
                                           texto:['Reintentar?','Retry?'],
                                           _onload()
                                           {

                                            this.xini = this.xg;
                                            this.yini = this.yg;
                                            this.wini = this.w;
                                            this.hini = this.h;

                                            this.x= 8+(game.wcanvas-16)/2-this.w/2;
                                            this.xini=this.x;

                                           },
                                           on_click:()=>{
                                            game.escenario.set('play_0');
                                            }
                                           })

                    


                    
                let _mp = game.botoncon.crear_boton($root, {x:32, y:180, fuente:'opciones',
                                            texto:['Menu principal','Main Menu'],
                                            _onload()
                                           {

                                            this.xini = this.xg;
                                            this.yini = this.yg;
                                            this.wini = this.w;
                                            this.hini = this.h;

                                            this.x= 8+(game.wcanvas-16)/2-this.w/2;

                                            this.xini=this.x;

                                           },
                                           on_click:()=>{
                                            game.escenario.set('main_menu');
                                            }
                                           })

                    //_mp.x=_base.x+_base.w/2-_mp.w/2;
                    //_mp.xini=_mp.x;


                this.remove();
              }
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
                  j[0]=this.hitcon.hits;

              }

             }

              
             this.orien=0;
             if(this.estado==1||this.estado==3)
              this.orien=1;
             this.anim._z=10;
             this.anim.animdata.set_anim(this.estado_h);
             this.anim.x=-11+10;
             this.anim.y=2;
             //this.anim._w=50;
             this.anim._w=this.anim.h-5;

             //this.anim.x=0;
             //this.anim.y=0;

          //  this.draw_color='blue';
          //  this.anim.draw_color='rgba(255,0,0, 0.5)';
            //this.anim.rotation+=0.1;
            //this.anim._w+=0.1;
            this.anim.rotation_c=[this.anim.w/2,this.anim.h-10];
             
       },

}

