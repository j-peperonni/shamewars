_BOSSDATA =
       {
       	//|sucubo
        sucubo:
        {
            mini:
            {  
               animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 0], [0, 1]] },
                                             
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 2]]  },
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 3]]  },
                                             { remove_on_loop: 0, ll: 20, wt:32,ht:32, buf: [[0, 4]]  },

                                             ),  
                          loadframe(){
                           this.name = 'sucubo';
                           this.tt=[rand_bet_(0,50),rand_bet_(20,100),   rand_bet_(0,1)];
                           this.polvo_tt=[0,10];
                           this.volar_estado=0;
                          },
                          enterframe()
                          {
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
                          	if(this.foo!==1)
                          		{
                          	    this.foo=1;
                           
                               crear_particula($root.level, {anim_id:10, xvelocity:this.	xvelocity/2,enterframe(){
                      this.yvelocity+= this.grav;
                      
                      this.x = this.x + this.xvelocity;
                      this.y = this.y + this.yvelocity;

                      //this.rotation+=0.02;

                                                         },grav:0.03, x:this.x, y: this.y});//calzoncito
                               this.animdata.set_anim(rand_bet_(1,3));
                               }
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
                  


                  this.x=get_level_xw();
                },
                enterframe()
                {
                  this.xprev=this.x;
                  this.yprev=this.y;
                  if(this.ropas_n==0)
                  {

                  game.playcon.play(7);
                  this.set_pose(2);
                  this.ropas_n=-1;	
                  }
                  
                 if(game.escenario.act.muerto==0)
                 {
                  let _jugador = $root.level.jugador;
                  this.x += ( (get_level_xw()-100)-this.x )/30;
                  if(this.act_pose_n!==2)
                  {
                  this.y += ( (_jugador.y-80)-this.y )/100;	
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
                  hit:[10, 5, 6], // salud, score, sonido id
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


                                                            if(this.shoot!==1)
                                                            {
                                                            this.y_ini +=this.creador.y-this.creador.yprev;
                                                            this.x_ini +=this.creador.x-this.creador.xprev;

                                                            this._w += (30-this._w)/40;
                                                            this._h += (30-this._w)/40;	
                                                            this.x=this.x_ini-this._w/2;
                                                            this.y=this.y_ini-this._h/2;

                                                            
                                                             

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
                  hit:[10, 5, 6], // salud, score, sonido id
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
             animdata: GAME.crear_animdata({ master: { wt: 16, ht: 16, ll: 30 } },
                                           { remove_on_loop: 0, ll: 20, wt:32,ht:32,flip:[1,0], buf: [[1,0]] }
                                           ),  
             
             loadframe(){
              this.name = 'blondie';
              let _tilemap = GES.tileges.tilemaps[1];
              this.y=0;

              for(var i=0;i<30;i++)
                {
                   if(_tilemap[i]&&_tilemap[i][fl(this.x/16) ]>0)
                   {
                    //this.draw_color='blue';
                    this.y=i*16-32;
                    return;
                   }
                }
                 this.y=500;

             },
             enterframe()
             {

             },
             on_player_hit(){},
             on_weapon_hit(){},
          },
          big:
          {
          girl_id:1,

          }

        },

      } //end data