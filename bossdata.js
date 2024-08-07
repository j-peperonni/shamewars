_BOSSDATA =
       {
        //|objects
        objects:
        {
          moai:
          {
           tile_id:103,
           anim_id:0,
           canvas_id:1,
           animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                             { offset:[2,0], ll: 20, wt:16,ht:32, buf: [[0, 0] ] },
                                             
                                             { offset:[2,0], ll: 20, wt:16,ht:32, buf: [[0, 1] ] },
                                             { offset:[2,0], ll: 20, wt:16,ht:32, buf: [[0, 2] ] },
                                            

                                             ),   
           tt_ataque:[0,50, 100],
           muerto:0,
           on_weapon_hit()
           {
            if(this.muerto!==1)
              game.playcon.play(15);

           this.animdata.set_anim(2);
           this.muerto=1;
           },
           _loadframe(){},
           _enterframe(){
            if(this.muerto)return;
           this.tt_ataque[0]++;
           if(this.tt_ataque[0]==this.tt_ataque[1])
           {
            this.animdata.set_anim(1);
            game.enemcon.crear_mini('sucubo', {x:this.x, y:this.y});
           }
            

           if(this.tt_ataque[0]==this.tt_ataque[2])
            {
              this.animdata.set_anim(0);
              this.tt_ataque[0]=0;
            }            

           },
           on_player_hit()
           {
            if(this.muerto==0)
            {
             $root.level.jugador.hitcon.hit('empelotada');
            }
           },

          },//end moai

          espina:
          {
           tile_id:123,
           anim_id:0,
           canvas_id:1,
           animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                             { offset:[0,0], ll: 20, wt:16,ht:16, buf: [[16*1, 16*0+10,  16,5] ] },
                                             
                                             ),   
           //draw_color:'blue',
           estado:0,
           return_tt:0,
           on_weapon_hit(){},
           _loadframe(){
            this.y+=20;
            this.x_ini=this.x;
            this.y_ini=this.y;
            this._h=2;

            _clip = GES.crear_imagen(this, 18, 1, { x:0,y:-5,w:16,h:5, cut_cords:{x:16,y:0, w:16,h:5 }});
          

           },
           _enterframe(){
            let _jugador = $root.level.jugador;

            if(this.estado==0&&_jugador.x+_jugador.w>this.x && _jugador.x<this.x+16)
            {
              game.playcon.play(16);
              this.estado=1;
            }
            
            if(this.estado==1)
            { 
              this._h += ( 27-this._h)/7;   

              if(this._h>=21&&(_jugador.x+_jugador.w<this.x-10 || _jugador.x>this.x+16+10) )
              {
                
                this.estado=0;
              }
               
            }
            if(this.estado==0)
            {

             this._h += ( 2-this._h)/7;   
            }

            this._h =  fl(this._h);
            this.y  =  fl(this.y_ini-this._h);
            
               
            
           },
           on_player_hit()
           {
            
             $root.level.jugador.hitcon.hit('clavada');
            
           },

          },//end espina
         

        },//objects

       	//|sucubo
        sucubo:
        {
            mini:
            {  
               tile_id:100,
               animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 0], [0, 1]] },
                                             
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[0,64*1,  16*4,16*4]] },
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[0,64*2,  16*4,16*4]] },
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[0,64*3,  16*4,16*4]] },

                                             ),   
                          loadframe(){
                           this.name = 'sucubo';
                           this.tt=[rand_bet_(0,50),rand_bet_(20,100),   rand_bet_(0,1)];
                           this.polvo_tt=[0,10];
                           this.volar_estado=0;
                          },
                          enterframe()
                          {
                            if(this.volar_estado==1)return;
                            let _tt = this.tt;
           
                         this.rotation=-0.1+this.yvelocity/10;
                         this.rotation_c=[16,16];
                           this.polvo_tt[0]++;
                           if(this.polvo_tt[0]>=this.polvo_tt[1])
                           {
                            this.polvo_tt[0]=0;
                            GES.crear_vacio($root.level, 1,{x:this.x+this.w, y:this.y+this.h/2, w: 2, h: 2, tt:[0,30],
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



                            if(this.estado==0)
                             {
                             this.x--;
                             _tt[0]++;
                             if(_tt[0]>=_tt[1])
                             {
                                   _tt[0]=0;
                                   _tt[2]=flipbin(_tt[2]);
                             }

                              if(_tt[2]==0)
                              {
                              this.yvelocity -=0.05;     
                                if(this.yvelocity<-1)
                                   this.yvelocity=-1;

                              }

                              if(_tt[2]==1)
                              {
                              this.yvelocity +=0.05;     
                                if(this.yvelocity>1)
                                   this.yvelocity=1;
                            
                              }
                             }

                             if(this.macroestado==1)
                             {
                                   
                             }   

                            
                            
                          },
                          _on_player_hit(){},
                          _on_weapon_hit(){
                          	/*if(this.foo!==1)
                          		{
                          	    this.foo=1;
                           
                               crear_particula($root.level, {anim_id:10, xvelocity:this.xvelocity/2+Math.random()*this.xvelocity,
                                                                         yvelocity:this.yvelocity/2+Math.random()*this.yvelocity, grav:0.03, x:this.x, y: this.y});//calzoncito
                               crear_particula($root.level, {anim_id:11, xvelocity:this.xvelocity/2+Math.random()*this.xvelocity,
                                                                         yvelocity:this.yvelocity/2+Math.random()*this.yvelocity, grav:0.03, x:this.x, y: this.y});//sosten
                               this.animdata.set_anim(rand_bet_(1,3));
                               }
                               */
                          },
            },
            big:
            {
                girl_id:0,
                x:100,
                y:0,
                w:100,
                h:100,
                

                ini_pose:0,

                //draw_color:'blue',
                loadframe()
                {
                  this.set_dialogo(['Asi que, eres elena?', 'ss']);
                  setTimeout(()=>{this.set_dialogo(['Veremos si vales la pena', 'ss']);  },2000 )
                 
                  this.x=get_level_xw();
                },
                enterframe()
                {
                  this.xprev=this.x;
                  this.yprev=this.y;
                  if(this.ropas_n==0)
                  {
                    this.set_dialogo(['Eh?', 'ss']);
                  setTimeout(()=>{game.playcon.play(random_from_array([13]),5 );
                             

                               },500 )
                  setTimeout(()=>{
                             this.set_dialogo(['NO ME SILVEN!', 'ss']);

                               },1500 )
                  //setTimeout(()=>{game.playcon.play(random_from_array([7]),1 );},1700 )
                  
                  this.set_pose(2);
                  this.ropas_n=-1;	
                  }
                  
                 if(game.escenario.act.muerto==0)
                 {
                  let _jugador = $root.level.jugador;
                  this.x += ( (get_level_xw()-100)-this.x )/30;
                  if(this.act_pose_n!==2)
                  {
                  this.y += ( (_jugador.y-80)-this.y )/(100);	

                  }
                 }
                  
                 
                 
                },
                on_player_hit(){},
                on_weapon_hit(){},
                poses:
                [
                 [//0:stand partes
                 {//cola
                  x:65,
                  y:68,
                  cut:[0,11,  3,2],
                  loadframe(){},
                  enterframe(){}
                 },
                 {//ala <-
                  flip_x:1,
                  x:-25,
                  y:30,
                  cut:[6,13,  4,2],
                  rotation_c:[0,0],  
                  tt:[1,1],
                  tt_wing:[0,-8, 0],
                  //draw_color:'red',
                  
                   

                  loadframe(){},
                  enterframe(){
                     let _tt = this.tt_wing;  _tt[0]+=(_tt[1]-_tt[0])/3;
                     if(_tt[0]>=_tt[1]-1&&_tt[0]<=_tt[1]+1) _tt[1]*=-1;

                     this.rotation_c=[this.w-4,16+8];
                     this.rotation=_tt[0]/10+0.3;
                    
                  }
                 },

                 {//ala ->
                  x:55,
                  y:25,
                  cut:[6,13,  4,2],
                  rotation_c:[16*0,16],  
                  tt:[1,1],
                  tt_wing:[0,8, 0],
                  //draw_color:'red',
                  

                  loadframe(){},
                  enterframe(){
                      let _tt = this.tt_wing;

                     _tt[0]+=(_tt[1]-_tt[0])/3;

                     if(_tt[0]>=_tt[1]-1&&_tt[0]<=_tt[1]+1)
                      _tt[1]*=-1;

                     this.rotation_c=[4,16+8];
                     this.rotation=_tt[0]/10+0.3;

                    
                  }
                 },

                {//brazo <-
                  x:-13,
                  y:40,
                  cut:[10,3,  4,3],
                  rotation_c:[16*3,16],  
                  tt:[1,1],
                  //draw_color:'red',
                  
                  loadframe(){},
                  enterframe(){
                    if(this.tt[0]==1){ this.tt[1]+=0.03; if(this.tt[1]>1)this.tt[0]=0; }
                    if(this.tt[0]==0){ this.tt[1]-=0.03; if(this.tt[1]<0)this.tt[0]=1; }

                    this.rotation=-1+this.tt[1]/1.5;
                  }
                 },
                {//cuerpo
                  x:20,
                  y:35,
                  cut:[3,3,  7,9],
                  loadframe(){

                  crear_boss_hitbox(this, 2,{x:30-20,y:10-35,w:30,h:80})
                  crear_boss_hitbox(this, 2,{x:40-20,y:80-35,w:30,h:45})
                  crear_boss_hitbox(this, 2,{x:50-20,y:110-35,w:30,h:30})
                  crear_boss_hitbox(this, 2,{x:70-20,y:120-35,w:30,h:30})

                  },
                  enterframe(){

                  }
                 },
                 {//cubrechoro
                  es_ropa:1,
                  x:30,
                  y:80,
                  hit:[10, 5, 5], // salud, score, sonido id
                  cut:[0,13,  3,2],
                  loadframe(){},
                  enterframe(){}
                 },
                 {//cabeza
                  x:10,
                  y:0,
                  estado:0,
                  tt:[0,50],
                  tt_atk:[0,50],

                  cut:[0,0,  4,3],
                  attack()
                  {
                        let _level = $root.level;
                    	//let _ataque = GES.cargar_clase(this, 3, {
                        let _ataque = GES.cargar_clase(_level, 3, {
                    		                                        anim_id:20,
                                                              //      x: -_level.x+this.rx+25,
                                                                 //    y: -_level.y+this.ry+40,
                                                                creador:this.padre,                                     
                                                                x:this.rx+28-_level.x,
                                                                y:this.ry+40-_level.y,
                                                                //y:30,
                                                                //y:this.ry+40,

                                                            on_weapon_hit()
                                                            {
                                                            game.playcon.play(14,0.7);
                                                            if($root.level.jugador.rx+$root.level.jugador.w/2<this.rx+this.w/2)
                                                            this.xvelocity=4;     
                                                            else
                                                            this.xvelocity=-4;     

                                                            this.yvelocity=($root.level.jugador.yvelocity/2)*2;
                                                            game.fadecon.flash('rgba(255,255,100, 0.8)', 2);

                                                            },
                                                            on_player_hit()
                                                            {
                                                              $root.level.jugador.hitcon.hit('electrocutada');
                                                              this.remove();
                                                            },
                                                            _loadframe()
                                                            {
                                                           	game.enemcon.push_clip(this);
                                                            
                                                            this._w=0;
                                                            this._h=0;
                                                            
                                                            },
                                                            _enterframe()
                                                            {

                                                            let _level = $root.level;
                                                            let _jugador = $root.level.jugador;

                                                            if(this.shoot==1)
                                                            {
                                                              let _col = col_check(this); 
                                                              if(_col[1]!==0)
                                                                this.remove();
                                                            }
                                                            if(this.shoot!==1)
                                                            {
                                                            this.y_ini +=this.creador.y-this.creador.yprev;
                                                            this.x_ini +=this.creador.x-this.creador.xprev;

                                                            this._w += (30-this._w)/40;
                                                            this._h += (30-this._w)/40;	
                                                            this.x=this.x_ini-this._w/2;
                                                            this.y=this.y_ini-this._h/2;

                                                            
                                                             this.xprev=this.x;
                                                              this.yprev=this.y;

                                                            }
                                                            
                                                            if(this._w>25 && this.shoot!==1)
                                                            {

                                                            this.shoot=1;
                                                            let _lanzar = lanzar_a_posicion(
                                                            	                            this.rx, 
                                                            	                            this.ry,
                                                            	                            _jugador.rx,
                                                            	                            _jugador.ry,
                                                            	                            4);
                                                            this.xvelocity=_lanzar[0];
                                                            this.yvelocity=_lanzar[1];
                                                            }

                                                            }
                        
                    	                                           });
                  },
                  loadframe(){},
                  enterframe(){

                     if(this.estado==0)
                     {

		                    this.tt[0]++;
		                    this.set_cut(0,0, 4,3);
		                    if(this.tt[0]>this.tt[1])
		                        this.set_cut(4,0, 4,3);
		                    
		                    
		                    if(this.tt[0]>this.tt[1]+5)
		                    	this.tt[0]=0-rand_bet_(0,90);

		                    if(rand_bet_(0,100)==1)
		                    	this.estado=1;
		                    	
		             }
		             if(this.estado==1)
                     {
                     	    this.set_cut(8,0, 4,3);
                     	    if(this.tt_atk[0]==1)
                     	    this.attack();
		                    this.tt_atk[0]++;
		                    if(this.tt_atk[0]>this.tt_atk[1])
		                    {
		                    	this.tt_atk[0]=0;
		                    	this.estado=0;
		                    }
		                    
		             }       

                  }
                 },
                 
                 {//brazo ->
                  x:50,
                  y:35,
                  cut:[0,6,  3,3],
                  tt:[0,1],
                  rotation_c:[0,16],
                  loadframe(){},
                  enterframe(){
                    if(this.tt[0]==1){ this.tt[1]+=0.03; if(this.tt[1]>1)this.tt[0]=0; }
                    if(this.tt[0]==0){ this.tt[1]-=0.03; if(this.tt[1]<0)this.tt[0]=1; }

                    this.rotation=this.tt[1]/1.5;
                  }
                 },
                 {//tetas
                  x:20,
                  y:50,
                  cut:[0,9,  3,2],
                  tt:[0,1],
                  //rotation_c:[16+8,16],
                  loadframe(){},
                  enterframe(){
            /*        if(this.tt[0]==1){ this.tt[1]+=0.03; if(this.tt[1]>1)this.tt[0]=0; }
                    if(this.tt[0]==0){ this.tt[1]-=0.03; if(this.tt[1]<0)this.tt[0]=1; }

                    this.rotation=-1+this.tt[1];
                    */
                  }
                 },
                 {//protejetetas
                  es_ropa:1,
                  x:22,
                  y:54,
                  hit:[10, 5, 5], // salud, score, sonido id
                  cut:[3,13,  3,2],
                  loadframe(){},
                  enterframe(){},
                  on_destroy()
                  {
                   
                  },
                  on_weapon_hit()
                  {
                   
                  },
                 },

                 ],//end 0


                 [//1
                  {//cola
                  x:65,
                  y:68,
                  cut:[0,11,  3,2],
                  loadframe(){},
                  enterframe(){}
                 },
                 ],

                 [//2

                  {//cuerpo
                  tt:0,
                  x:-20,
                  y:-10,
                  //filter:{hue:10},
                  cut:[0,15,  10,15],
                  shake:[0,10, 0],
                  loadframe(){},
                  enterframe(){
                    //this.filter.hue++;
                    this.shake[0]++;
                    if(this.tt>90&&this.zoo!==1)
                      {
        //              this.set_cut(0,30, 10,10,  1);
                      this.zoo=1;  
                      }

                    if(this.shake[0]>this.shake[1])
                    {
                      this.shake[0]=0;
                      if(this.tt>[90])this.shake[0]=9;

                      else
                        return;

                      
                      


                      if(this.shake[2]==0)this.y-=1;
                      else if(this.shake[2]==1)this.y+=1;

                      this.shake[2]=flipbin(this.shake[2]);
                    }
                    this.tt++;
                    if(this.tt>140)
                    {
                    	
                    	this.w += (0-this.w)/10;
                        this.h += (0-this.h)/10;

                        if(this.w<10)
                        	this.padre.end_battle();


                    }

                  }
                 },
                 ]


                ],//end poses
                
                
                 

                
                

            }
        },
        //|blondie
        blondie:
        {
          
          mini:
          {
            tile_id:110,
             animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32,flip:[1,0], buf: [[2,0]] },
                                             
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[64*1,64*1,  16*4,16*4]] },
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[64*1,64*2,  16*4,16*4]] },
                                             { offset:[8,8], ll: 20, wt:32,ht:32, buf: [[64*1,64*3,  16*4,16*4]] },
                                           ),  
             
             loadframe(){
              this.volar_estado=0;
              this.name = 'blondie';
              let _tilemap = GES.tileges.tilemaps[1];
              //this.y=0;


              /*for(var i=0;i<30;i++)
                {
                   if(_tilemap[i]&&_tilemap[i][fl(this.x/16) ]>0)
                   {
                    //this.draw_color='blue';
                    this.y=i*16-32;
                    return;
                   }
                }
                 this.y=500;
                 */

             },
             enterframe()
             {

              
             },
             on_player_hit(){},
             _on_weapon_hit(){
              
              },
          },
          big:
          {
          girl_id:1,
          ini_pose:0,
                x:100,
                y:30,
                w:100,
                h:100,
                //draw_color:'blue',
          loadframe()
          {
           this.x=get_level_xw();
           this.set_dialogo(['Buenos dias, querida.', 'ss']);
          },
          enterframe()
          {
             this.x += ( (get_level_xw()-100)-this.x )/30;

                  if(this.ropas_n==0)
                  {
                  setTimeout(()=>{game.playcon.play(random_from_array([13]),5);},500 )
                  //setTimeout(()=>{game.playcon.play(random_from_array([7]),1 );},1700 )
                  //game.playcon.play(random_from_array([7,13]));
                  this.set_pose(1);
                  this.ropas_n=-1;  
                  }


          },
          poses:
            [
                [//pose_a
                  {//cuerpo
                  x:0,
                  y:3*16-5,
                  cut:[3,4,  10,10],
                  },
                  {//cabeza
                  x:0,
                  y:0,
                  cut:[3,0,  6,4],
                  },
                  {//sosten
                  x:16*2-5,
                  y:16*2+7,
                  es_ropa:1,
                  hit:[10, 5, 6], // salud, score, sonido id

                  cut:[0,0,  3,3],
                  },
                  {//calzon
                  x:16*3-1,
                  y:16*5-3,
                  es_ropa:1,
                  hit:[10, 5, 6], // salud, score, sonido id
                  
                  cut:[0,3,  3,3],
                  }

                ],
                [//pose dead
                  {//cuerpo
                  x:0,
                  y:0,
                  tt:0,
                  cut:[3,15,  10,10],
                  enterframe()
                  {
                   this.tt++;
                    if(this.tt>140)
                    {
                      
                      this.w += (0-this.w)/10;
                        this.h += (0-this.h)/10;

                        if(this.w<10)
                          this.padre.end_battle();


                    }


                  }
                  },

                ]

            ]

          }

        },

      } //end data