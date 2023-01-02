let login=document.getElementById('login');
login.addEventListener('click',(e)=>{
    e.preventDefault();
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    if(email==='')
    {
        let e='*email cannot empty';
        popup(e);
        return;
    }
    if( pass==='')
    {
        let p='*password cannot empty';
        popup(p);
        return;
    }

    let user={email,pass};

    axios.post('http://13.232.243.73:4000/user/login',user)
    .then(user=>{
       console.log(user.data);
       if(user.data.success===true)
       {
        localStorage.setItem('token',user.data.token);
        window.location.href = "./expense-tracker.html"
       }  
    }).catch((err)=>{
        console.log(err);
        popup(err.response.data.message);
    })
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

let fPass=document.getElementById('forgot');
fPass.addEventListener('click',(e)=>{
    let form=document.querySelector('.login')
    form.innerHTML=`<label class="f-email">Email:</label>
                    <input type="email" class="fo-email" id="fo-email" name="email"><br><br>
                    <button id="Forgot">Submit</button>`

                    let submit=document.getElementById('Forgot');
                    submit.addEventListener('click',async(e)=>{
                        e.preventDefault();
                        let email=document.getElementById('fo-email').value;
                        let obj={email}
                        try{
                            await axios.post('http://13.232.243.73:4000/forgotpassword',obj)
                            .then(res=>{
                                console.log(res.data.link);
                                if(res.data.message==='no user found')
                                {
                                    popup(res.data.message);
                                }
                                else{
                                    //localStorage.setItem('id',res.data.id);
                                    form.innerHTML=`<a href=${res.data.link} class="generated-link">=> Click here to generate new password</a>`;
                                }
                            });
                        }
                        catch(err)
                        {
                            console.log(err);
                        }
                    });
});