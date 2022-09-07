var can=document.querySelector('canvas');
can.width=window.innerWidth;
can.height=window.innerHeight;
var c=can.getContext('2d');

// GAME STARTING CREDENTIALS
const XSTARTINGOFGAME=100;
const YSTARTINGOFGAME=100;


var playerLastLocation=[];

// BOARD CONTRAINTS
const NOOFROWS=6;
const NOOFCOLUMNS=6;
const WIDTHOFEACHBLOCK=60;
const HEIGTHOFEACHBLOCK=60;

//
const RADIUSOFSMALLCIRCLE=20;
const RADIUSOFVISIBLESMALLCIRCLE=10;
const RADIUSOFPLAYER=20;

// LOCATION OF PLAYER
var playerLocation=[XSTARTINGOFGAME+WIDTHOFEACHBLOCK*(Math.floor((NOOFROWS+1)/2)),YSTARTINGOFGAME+HEIGTHOFEACHBLOCK*(Math.floor((NOOFCOLUMNS+1)/2))];

//
var atRest=true;
var clicked=false;
var mousePosition=[undefined,undefined];

// VELOCTIY OF PLAYER AND ENEMIES
const VELOCITYOFPLAYER=10;
const VELOCITYOFENEMY=1;


// PLAYER'S TARGET
var destination=[undefined,undefined];


var moveStatusOfEnemies=[false];

var enemydesx=undefined;
var enemydesy=undefined;

var enemyArray=[[100,100],[100+NOOFROWS *WIDTHOFEACHBLOCK,100],[100+NOOFROWS *WIDTHOFEACHBLOCK,100+HEIGTHOFEACHBLOCK*NOOFCOLUMNS],[100,100+HEIGTHOFEACHBLOCK*NOOFCOLUMNS],];
const NUMBEROFNENEMIES=4;

const RADIUSOFENEMY=10;

function onMouseClick(event){
    mousePosition[0]= event.clientX;
    mousePosition[1]=event.clientY;
    clicked=true;
    if(atRest==true){
        playerLastLocation=playerLocation;
         console.log(playerLocation);
    }
}


function drawRows(){
    for(let i=0;i<NOOFCOLUMNS+1;i++){
        c.beginPath();
        c.moveTo(XSTARTINGOFGAME,YSTARTINGOFGAME+i*HEIGTHOFEACHBLOCK);
        c.lineTo(XSTARTINGOFGAME+WIDTHOFEACHBLOCK*NOOFROWS,YSTARTINGOFGAME+i*HEIGTHOFEACHBLOCK);
        c.strokeStyle='black';
        c.stroke();}
}

function drawColumns(){
    for(let i=0;i<NOOFROWS+1;i++){
        c.beginPath();
        c.moveTo(XSTARTINGOFGAME+i*WIDTHOFEACHBLOCK,YSTARTINGOFGAME);
        c.lineTo(XSTARTINGOFGAME+i*WIDTHOFEACHBLOCK,YSTARTINGOFGAME+HEIGTHOFEACHBLOCK*NOOFCOLUMNS);
        c.strokeStyle='black';
        c.stroke();}
}

function drawBackGround(){
    drawRows();
    drawColumns();
}


function drawPlayer(){
    c.beginPath();
    c.arc(playerLocation[0],playerLocation[1],RADIUSOFPLAYER,0,Math.PI*2,false);
    c.strokeStyle='blue';
    c.stroke();
}


function drawSmallCircle(x,y){
    c.beginPath();
    c.arc(x,y,RADIUSOFVISIBLESMALLCIRCLE,0,Math.PI*2,false);
    c.strokeStyle='red';
    c.stroke();
}

function drawSmallCircles(){
    for(var i=0;i<NOOFROWS+1;i++){
        for(var j=0;j<NOOFCOLUMNS+1;j++){
            drawSmallCircle(XSTARTINGOFGAME+i*WIDTHOFEACHBLOCK,YSTARTINGOFGAME+j*HEIGTHOFEACHBLOCK);
        }
    }
}

function drawEnemy(x,y){
    c.beginPath();
    c.arc(x, y, RADIUSOFENEMY, 0, 2 * Math.PI, false);
    c.fillStyle = 'green';
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = '#00ffff';
    c.stroke()
    }
    
    function drawEnemies(){
        for(var i=0;i<NUMBEROFNENEMIES;i++){
            drawEnemy(enemyArray[i][0],enemyArray[i][1]);
        }
    }

    ///////////////////////////////////////////////////////
    
function insideCircle(x1,y1,x2,y2){
    var dis=Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    if(dis<=RADIUSOFSMALLCIRCLE){
        return true;
    }
    else if(dis>RADIUSOFSMALLCIRCLE){
        return false;
    }
}

function insideAnyCircle(x,y){  
    var got=false;
    var movement=[undefined,undefined];
    for(var i=0;i<NOOFROWS+1;i++){
        for(var j=0;j<NOOFCOLUMNS+1;j++){
             if((XSTARTINGOFGAME+i*WIDTHOFEACHBLOCK==playerLocation[0])^((YSTARTINGOFGAME+j*HEIGTHOFEACHBLOCK)==playerLocation[1])){
                if(insideCircle(XSTARTINGOFGAME+i*WIDTHOFEACHBLOCK,YSTARTINGOFGAME+j*HEIGTHOFEACHBLOCK,x,y)==true){
                    movement[0]=i;
                    movement[1]=j;
                    got=true;
                    break;
                }
            }
        }
        if(got==true){
            break;
        }
    }
    return movement;
}

function movePlayerTo(x,y){
    if(playerLocation[0]==x){
        if(playerLocation[1]>y){
            playerLocation[1]=playerLocation[1]-VELOCITYOFPLAYER;     
        }
        else if(playerLocation[1]<y){
            playerLocation[1]=playerLocation[1]+VELOCITYOFPLAYER;     
        }
    }
    else if(playerLocation[1]==y){
        if(playerLocation[0]>x){
            playerLocation[0]=playerLocation[0]-VELOCITYOFPLAYER;     
        }
        else if(playerLocation[0]<x){
            playerLocation[0]=playerLocation[0]+VELOCITYOFPLAYER;     
        }
    }
}


function updatePlayer(){
    destination=[undefined,undefined];
    [destination[0],destination[1]]=insideAnyCircle(mousePosition[0],mousePosition[1]); 
    
    if(destination[0]!=undefined && destination[1]!=undefined){
        movePlayerTo(XSTARTINGOFGAME+ WIDTHOFEACHBLOCK*destination[0],YSTARTINGOFGAME+ HEIGTHOFEACHBLOCK *destination[1]);
    }
    if((XSTARTINGOFGAME+ WIDTHOFEACHBLOCK*destination[0])==playerLocation[0] && ((YSTARTINGOFGAME+ HEIGTHOFEACHBLOCK *destination[1])==playerLocation[1])){
        atRest=true;
        clicked=false;
    }
    else{
        atRest=false;
    }
}

function enemyTargetLocation(){
    var x;
    var y;
    if(destination[0]!=undefined && destination[1]!=undefined){
        x=destination[0]*WIDTHOFEACHBLOCK+XSTARTINGOFGAME;
        y=destination[1]*HEIGTHOFEACHBLOCK+YSTARTINGOFGAME;
    }
    else{
        x=playerLocation[0];
        y=playerLocation[1];}
    return [x,y];
}



function updateEnemy(i){
    [enemydesx,enemydesy]=enemyTargetLocation();
    got=false;
    for(l=0;l<NOOFROWS+1;l++){  
        if(got==true){
            break;
        }      
        for(j=0;j<NOOFCOLUMNS+1;j++){
            if((enemyArray[i][0]==XSTARTINGOFGAME+l*WIDTHOFEACHBLOCK)&&(enemyArray[i][1]==YSTARTINGOFGAME+j*HEIGTHOFEACHBLOCK)){
                moveStatusOfEnemies[i]=false;
                got=true;
                break;
            }
        }
    }
    var velocity=[0,0];
    if(enemydesx!=undefined && enemydesy!=undefined){
        if(enemyArray[i][0]<=enemydesx && enemyArray[i][1]<=enemydesy){
            velocity=[1,1];
            if(enemyArray[i][0]==enemydesx){
                velocity=[0,1];
            }
            if(velocity[0]==1){
                var a=Math.floor(Math.random()*2);
                if(a==0){
                    enemyArray[i][0]=enemyArray[i][0]+VELOCITYOFENEMY;
                }
                else{
                    enemyArray[i][1]=enemyArray[i][1]+VELOCITYOFENEMY;
                }
            }
            else {
                enemyArray[i][1]=enemyArray[i][1]+VELOCITYOFENEMY;}
        }
        else if(enemyArray[i][0]>=enemydesx && enemyArray[i][1]<=enemydesy){
            velocity=[-1,1];
            if(enemyArray[i][1]==enemydesy){
                velocity=[-1,0];
            }
            if(velocity[1]==1){
                var a=Math.floor(Math.random()*2);
                if(a==0){
                    enemyArray[i][0]=enemyArray[i][0]-VELOCITYOFENEMY;
                }
                else{
                    enemyArray[i][1]=enemyArray[i][1]+VELOCITYOFENEMY;
                }
            }
            else if(velocity[0]==-1){
                enemyArray[i][0]=enemyArray[i][0]-VELOCITYOFENEMY;}
        }
        else if(enemyArray[i][0]<=enemydesx && enemyArray[i][1]>=enemydesy){
            velocity=[1,-1];
            var a=Math.floor(Math.random()*2);
            if(a==0){
                enemyArray[i][0]=enemyArray[i][0]+VELOCITYOFENEMY;
            }
            else{
                enemyArray[i][1]=enemyArray[i][1]-VELOCITYOFENEMY;
            }
        }
        else if(enemyArray[i][0]>=enemydesx && enemyArray[i][1]>=enemydesy){
            velocity=[-1,-1];
            var a=Math.floor(Math.random()*2);
            if(a==0){
                enemyArray[i][0]=enemyArray[i][0]-VELOCITYOFENEMY;
            }
            else{
                enemyArray[i][1]=enemyArray[i][1]-VELOCITYOFENEMY;
            }
        }

    }
}


function update(){
    c.clearRect(0,0,can.width,can.height);
    updatePlayer();
    updateEnemies();
}

function draw(){
    drawEnemies();
    drawBackGround();
    drawPlayer();
    drawSmallCircles();
}

function updateEnemies(){
    for(var i=0;i<NUMBEROFNENEMIES;i++){
        updateEnemy(i);
    }
}

function killPlayer(){
    for(let i=0;i<enemyArray.length;i++){
        var dis=Math.sqrt(Math.pow(enemyArray[i][0]-playerLocation[0],2)+Math.pow(enemyArray[i][1]-playerLocation[1],2));
        if(dis<RADIUSOFENEMY+RADIUSOFPLAYER){
        alert("gameover");
        }
    }
}


function main(){
    requestAnimationFrame(main);
    update();
    killPlayer();
    draw();
}
main();
