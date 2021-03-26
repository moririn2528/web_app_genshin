const interval_time={
    ore:72,
    ore2:72,
    relic:24,
    relic12:12,
    frozen_meat:12,
    fish:12,
    crab:12,
    hass:24,
    Mondo_chicken:12,
    strange_fang:48
}

window.onload=function(){
    console.assert(navigator.cookieEnabled);
    document.cookie="test=1";
    console.log(document.cookie);
}

let item_select=document.getElementById("item_select");

function zero_pad(num,leng){
    return (Array(leng).join('0')+num).slice(-leng);
}

function int_to_time_string(tm){
    console.assert(!isNaN(tm));
    tm=Math.floor(tm/1000);
    let time_string=zero_pad(tm%60,2);
    tm=Math.floor(tm/60);
    time_string=zero_pad(tm%60,2)+":"+time_string;
    tm=Math.floor(tm/60);
    time_string=zero_pad(tm%24,2)+":"+time_string;
    tm=Math.floor(tm/24);
    if(tm>0)time_string=tm+"d "+time_string;
    return time_string;
}

function int_to_date_string(tm){
    let d=new Date();
    d.setTime(tm);
    return d.toLocaleString();
}

function find_from_cookie(item){
    let cookie_array=document.cookie.split(";");
    let start_time=0,end_time=0;

    cookie_array.forEach(elem =>{
        if(elem.trim()=="")return;
        let elem_array=elem.trim().split("=");
        console.assert(elem_array.length>=2);
        if(elem_array[0]==item){
            if(elem_array[1]=="")return;
            let elem_array2=elem_array[1].split("-");
            console.assert(elem_array2.length>=2);
            console.assert(start_time==0 && end_time==0);
            start_time=parseInt(elem_array2[0],10);
            end_time=parseInt(elem_array2[1],10);
        }
    });
    return [start_time,end_time];
}

function display(){
    const hour_mili_sec=60*60*1000;
    let item=item_select.value;
    let message_place=document.getElementById("remaining_time");
    if(item=="")return;
    let [start_time,end_time]=find_from_cookie(item);
    let flag=false;
    let message="";
    console.log(item+":"+start_time+":"+end_time);

    if(end_time>0){
        message+="前回: ";
        if(start_time>0)message+=int_to_date_string(srart_time)+" ";
        message+="～ "+int_to_date_string(end_time)+"<br>";
        if(start_time>0)message+="経過時間: "+int_to_time_string(end_time-start_time)+"<br>";
    }
    if(start_time>0){
        message+=int_to_date_string(srart_time)+" ～ <br>";
    }
    console.log(message);
    if(end_time>0){
        console.assert(item in interval_time);
        let remain_time=Math.max(interval_time[item]*hour_mili_sec-(Date.now()-end_time),0);
        if(remain_time>0){
            console.log(int_to_time_string(remain_time));
            message+="次回: "+int_to_date_string(end_time+interval_time[item]*hour_mili_sec)+"<br>";
            message+="残り時間: "+int_to_time_string(remain_time)+"<br>";
            message_place.style.backgroundColor="bisque";
            flag=true;
        }
    }
    if(!flag){
        message+="採取可能";
        message_place.style.backgroundColor="palegreen";
    }
    message_place.innerHTML=message;
}

item_select.onchange=display;
let bef_set_start_time=0,bef_item="";

document.getElementById("set_start_time").onclick=function(){
    bef_set_start_time=Date.now();
    bef_item=item_select.value;
    display();
}
document.getElementById("set_end_time").onclick=function(){
    const month_sec=60*60*24*30;
    let item=item_select.value;
    if(bef_item.length>0 && bef_item!=item){
        alert("先に "+item+" を終了してください。");
        return;
    }
    let end_time=Date.now();
    console.log(item+":"+end_time);
    document.cookie=item+"="+bef_set_start_time+"-"+end_time+";max-age="+month_sec;
    console.log(item+"="+bef_set_start_time+"-"+end_time+";max-age="+month_sec);
    console.log(document.cookie);
    bef_set_start_time=0;
    bef_item="";
    display();
}
document.getElementById("reset_time").onclick=function(){
    let item=item_select.value;
    document.cookie=item+"=;max-age=0";
}
