window.addEventListener('DOMContentLoaded',async (e)=>{
    let Token=localStorage.getItem('token');
   try{
    await axios.get('http://13.232.243.73:4000/user/leaderboard',{headers:{'leader':Token}})
    .then(user=>{
        console.log(user);
        let u=document.querySelector('.user');
        u.innerText=`Hello 👑${user.data.pUser}`;
    
             show(user.data);
        
    });
   }
   catch(err){
    console.log(err);
   }
});

function show(data)
{
    for(var i=0;i<data.obj.length;i++)
    {
    let containr=document.querySelector('.user-container');
    let newButton=document.createElement('button');
    newButton.className='user-c';
    newButton.textContent=data.obj[i].name;
    containr.appendChild(newButton);
    let span=document.createElement('span');
    span.className='user-e';
    span.id=data.obj[i].id;
    span.textContent=0;
    containr.appendChild(span);
    let hr=document.createElement('hr');
    containr.appendChild(hr);
    let br=document.createElement('br');
    containr.appendChild(br);
    }

    for(var i=0;i<data.exp.length;i++)
    {
        showSpan(data.exp[i]);
    }

    function showSpan(e)
    {
        let s=document.getElementById(e.userId);
        let amount=parseFloat(e.amount);
        s.innerText=amount+parseFloat(s.innerText);
    }

    let call=document.getElementsByClassName('user-c');
    for(var i=0;i<call.length;i++)
    {
        call[i].addEventListener('click',async(e)=>{
           let name= e.target.innerText;
           try{
            axios.get('http://13.232.243.73:4000/leaderBoard/expenses',{headers:{'name':name}})
            .then((res)=>
            {
                if(res.data.message==='cant see expenses of other premium user')
                {
                    let main=document.querySelector('.main');
                    main.innerHTML='';
                    popup(res.data.message);
                    return;
                }
                else{
                    let main=document.querySelector('.main');
                    main.innerHTML='';
                    for(var i=0;i<res.data.obj.length;i++)
                    {
                        showExpe(res.data.obj[i]);
                    }
                }
            });
           }
           catch(err)
           {
            console.log(err);
           }
        })
    }
    
};

function showExpe(data)
{
    let main=document.querySelector('.main');
    main.innerHTML+=`<ul class="e-container">
    => Amount:${data.amount}-Description:${data.description}-Category:${data.category}
    </ul>`
}

let Home=document.getElementById('home');
Home.addEventListener('click',(e)=>{
    window.location='./expense-tracker.html'
});

function popup(data)
{
  let element=document.querySelector('.popup');
      let n_element=document.createElement('div');
      n_element.className='toast';
      n_element.innerText=data;
      element.appendChild(n_element);
      setTimeout(()=> {
        n_element.remove();
        },2000); 
}