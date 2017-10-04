window.onload=function()
{
    var startBtn=document.getElementById("gameBtn");
    startBtn.onclick=function()
    {
        this.style.display='none';
        Game.init('div1');
    }
};

var Game=
{
    oEnemy://����
    {
        e1:{style:'enemy1',blood:1,speed:5,score:1},
        e2:{style:'enemy2',blood:2,speed:7,score:2},
        e3:{style:'enemy3',blood:3,speed:10,score:3}
    },
    gk:[//�ؿ�����
        {
            eMap:[
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum:10,
            isSpeedX:10,
            isSpeedY:10,
            times:2000
        },
        {
            eMap:[
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum:10,
            isSpeedX:10,
            isSpeedY:10,
            times:2000
        }
    ],
    ari1://�ɻ�����
    {
        style:'air1',
        bulletStyle:'bullet'
    },
    init:function(id)//��Ϸ��ʼ������ʼ��Ϸ
    {
        this.oParent=document.getElementById(id);
        this.createScore();
        this.createEnemy(0);
        this.createAir();
        this.binAir();
    },
    createScore:function()//���ֵĴ���
    {
        var oS=document.createElement("div");
        oS.id="score";
        oS.innerHTML='����:<span>0</span>';
        this.oParent.appendChild(oS);

        this.osNumber=oS.getElementsByTagName("span")[0];//�ѻ��ּ���Game��������,�Ա�������Ļ���
    },
    createEnemy:function(iNow)//��������
    {
        if(this.oUl)
        {
            clearInterval(this.oUl.timer);
            this.oParent.removeChild(this.oUl);
        }
        var gk=this.gk[iNow];
        var oUl=document.createElement("ul");
        oUl.id="bee";
        this.oUl=oUl;
        oUl.style.width=gk.colNum*40+"px";
        this.oParent.appendChild(oUl);//Ҫ�����֮�����oUl�Ŀ�
        oUl.style.left=(this.oParent.offsetWidth-oUl.offsetWidth)/2+"px";//���������˺о���

        var arrSet=[];
        for(var i=0;i<gk.eMap.length;i++)
        {
            var oLi=document.createElement("li");
            oLi.className=this.oEnemy[gk.eMap[i]].style;
            oLi.blood=this.oEnemy[gk.eMap[i]].blood;
            oLi.speed=this.oEnemy[gk.eMap[i]].speed;
            oLi.score=this.oEnemy[gk.eMap[i]].score;
            oUl.appendChild(oLi);
        }
        this.allLi=oUl.getElementsByTagName("li");

        for(i=0;i<this.allLi.length;i++)
        {
            arrSet.push([this.allLi[i].offsetLeft,this.allLi[i].offsetTop]);
        }
        for(i=0;i<this.allLi.length;i++)
        {
            this.allLi[i].style.position="absolute";
            this.allLi[i].style.left=arrSet[i][0]+"px";
            this.allLi[i].style.top=arrSet[i][1]+"px";
        }
        this.runEnemy(gk);
    },
    runEnemy:function(gk)//�ƶ�����
    {
        var self=this,
            l= 0,
            r=this.oParent.offsetWidth-this.oUl.offsetWidth;
        this.oUl.timer=setInterval(function(){
            if(self.oUl.offsetLeft>r)
            {
                gk.isSpeedX*=-1;
                self.oUl.style.top=self.oUl.offsetTop+gk.isSpeedY+"px";
            }
            else if(self.oUl.offsetLeft<l)
            {
                gk.isSpeedX*=-1;
                self.oUl.style.top=self.oUl.offsetTop+gk.isSpeedY+"px";
            }
            self.oUl.style.left=self.oUl.offsetLeft+gk.isSpeedX+"px";
        },200);
        setInterval(function(){
            self.oneMove();
        },gk.times)
    },
    oneMove:function()//�������˷���
    {

        var nowLi =this.allLi[Math.floor(Math.random()*this.allLi.length)],self=this;
        nowLi.temer=setInterval(function(){
            var a=(self.oA.offsetLeft+self.oA.offsetWidth/2)-(nowLi.offsetLeft+nowLi.parentNode.offsetLeft+nowLi.offsetWidth/2);
            var b=(self.oA.offsetTop+self.oA.offsetHeight/2)-(nowLi.offsetTop+nowLi.parentNode.offsetTop+nowLi.offsetHeight/2);
            var c=Math.sqrt(a*a+b*b);
            var isX=nowLi.speed*a/c;
            var isY=nowLi.speed*b/c;
            nowLi.style.left=nowLi.offsetLeft+isX+"px";
            nowLi.style.top=nowLi.offsetTop+isY+"px";

            if(self.pzCheck(self.oA,nowLi))
            {
                alert("��Ϸ������");
                  window.location.reload();
            }
        },30)
    },
    createAir:function()//�ɻ��Ĵ���(�Լ�����)
    {
        var oA=document.createElement("div");
        this.oA=oA;
        oA.className=this.ari1.style;
        this.oParent.appendChild(oA);
        oA.style.left=(this.oParent.offsetWidth-oA.offsetWidth)/2+"px";
        oA.style.top=this.oParent.offsetHeight-oA.offsetHeight+"px";
    },
    binAir:function()//�����ƶ��ɻ�
    {
        var timer=null,
            toDir= 0,
            self=this;
        document.onkeyup=function(e)
        {
            var event=e?e:window.event;
            clearInterval(timer);
            timer=null;
            toDir=0;
            if(event.keyCode==32)
            {
                self.createBullet();
            }
        };
        document.onkeydown=function(e)
        {
            var event=e?e:window.event;
            if(!timer)
            {
                timer=setInterval(show,30);
            }
            if(event.keyCode==37)//����
            {
                toDir=1;
                /* alert("left");*/
            }
            else if(event.keyCode==38)//����
            {
                toDir=3;
                /* alert("left");*/
            }
            else if(event.keyCode==40)//����
            {
                toDir=4;
                /* alert("left");*/
            }
            else if(event.keyCode==39)//����
            {
                toDir=2;
                /* alert("right");*/
            }
        };
        function show()
        {
            if(toDir==1)
            {
                if(self.oA.style.left<="-5px")
                    self.oA.style.left="-5px";
                else
                    self.oA.style.left=self.oA.offsetLeft-10+"px";
            }
            else if(toDir==2)
            {
                if(parseInt(self.oA.style.left)>=self.oA.parentNode.offsetWidth-self.oA.offsetWidth)
                    self.oA.style.left=self.oA.parentNode.offsetWidth-self.oA.offsetWidth+"px";
                else
                self.oA.style.left=self.oA.offsetLeft+10+"px";
            }
            else if(toDir==3)
            {
                if(parseInt(self.oA.style.top)<=0)
                    self.oA.style.top=0+"px";
                else
                    self.oA.style.top=self.oA.offsetTop-10+"px";
            }
            else if(toDir==4)
            {
                if(parseInt(self.oA.style.top)>=self.oA.parentNode.offsetHeight-self.oA.offsetHeight)
                    self.oA.style.top=self.oA.parentNode.offsetHeight-self.oA.offsetHeight+"px";
                else
                    self.oA.style.top=self.oA.offsetTop+10+"px";
            }
        }
    },
    createBullet:function()//�����ӵ�
    {
        var oB=document.createElement("div");
        oB.className=this.ari1.bulletStyle;
        this.oParent.appendChild(oB);
        oB.style.left=this.oA.offsetLeft+this.oA.offsetWidth/2+"px";
        oB.style.top=this.oA.offsetTop-10+"px";//10�ӵ��ĸ߶�this.oA.offsetHeight
        this.runBullet(oB);
    },
    runBullet:function(oB)//�ӵ��ƶ�
    {
        var self=this;
        oB.timer=setInterval(function(){
            if(oB.offsetTop<-10)
            {
                clearInterval(oB.timer);
                self.oParent.removeChild(oB);
            }
            else
                oB.style.top=oB.offsetTop-10+"px";

            for(var i=0;i<self.allLi.length;i++)
            {
                if(self.pzCheck(oB,self.allLi[i]))//�ж��Ƿ���ײ����
                {
                    //��ײ�Ͼ�ɾ������
                    if(self.allLi[i].blood==1)//���Ѫ������1��ɾ��
                    {
                        /* self.osNumber.innerHTML=parseInt(self.osNumber.innerHTML)+self.allLi[i].score;*/
                        /*  alert(self.osNumber.innerHTML)
                         alert(self.allLi[i].score)*/
                        clearInterval(self.allLi[i].temer);
                        self.oUl.removeChild(self.allLi[i]);
                        self.osNumber.innerHTML=parseInt(self.osNumber.innerHTML)+self.allLi[i].score
                    }
                    else
                    {
                        self.allLi[i].blood--;
                    }
                    clearInterval(oB.timer);
                    self.oParent.removeChild(oB);//Ԫ��ɾ���ˣ���ʱ��û��ɾ��

                }
            }
            if(!self.allLi.length)
            {
                self.createEnemy(1);
            }
        },30)
    },
    pzCheck:function(oBullet,oEnemy)//��ײ��⣬ԭ���Ǽ���ӵ������������Ƿ��ཻ��
    {
        var L1=oBullet.offsetLeft,
            R1=oBullet.offsetLeft+oBullet.offsetWidth,
            T1=oBullet.offsetTop,
            B1=oBullet.offsetHeight+oBullet.offsetTop;

        var L2=oEnemy.offsetLeft+oEnemy.parentNode.offsetLeft,
            R2=oEnemy.offsetLeft+oEnemy.offsetWidth+oEnemy.parentNode.offsetLeft,
            T2=oEnemy.offsetTop+oEnemy.parentNode.offsetTop,
            B2=oEnemy.offsetHeight+oEnemy.offsetTop+oEnemy.parentNode.offsetTop;//���ϸ��ڵ㣬���ӵ��͵�������ڴ�ڿ����λ�ã�

        if(R1<L2||L1>R2||B1<T2||T1>B2)
            return false;
        else
            return true;
    }
};
