import { useState, useEffect } from "react";
import axios from 'axios';
export default () => {
    const [total, setTotal] = useState(0);
    const [cart, setCart] = useState([]);
    const [form,setForm] = useState({"country":"United States"});
    const [noticeVisibility, setNoticeVisibility] = useState('none');
    const [noticeMsg, setNoticeMsg] = useState('');
    const [noticeType, setNoticeType] = useState('rgb(59 130 246)');
    const [loading, setLoading] = useState('none');
    const showNotice = function(msg,type){
      setNoticeVisibility('flex');
      setNoticeMsg(msg);
      if(type==true){
        setNoticeType('rgb(34 197 94)');
      }else if(type==false){
        setNoticeType('rgb(239 68 68)');
      }else{
        setNoticeType('rgb(59 130 246)');
      }
      setTimeout(function(){
        setNoticeVisibility('none');
      },3000)
    }
    const validateForm = function(type,input){
        let f = form;
        if(type=='first-name' || type=='last-name' || type=='city'){
            var regName = /^[a-zA-Z]+$/;
            if(!regName.test(input)){
                showNotice('Invalid input, try only with alphabetic characters',false); 
            }else{
                f[type]=input;
            }
        }else if(type=='email'){
            if(!input.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                showNotice('Invalid email',false); 
            }else{
                f[type]=input;
            }
        }else if(type=='zip'){
            var regName = /^[0-9]+$/;
            if(!regName.test(input)){
                showNotice('Invalid input, try only with numbers',false); 
            }else{
                f[type]=input;
            }
        }else{
            f[type]=input;
        }
        setForm({...f});
        console.log(form);     
    }
    const handleonclick = async()=>{
      setLoading('block');
      if(form['first-name'] && form['last-name'] && form.email && form.country && form['street-address'] && form.city && form.region && form.zip ){
        const {data} = await axios.post('http://localhost:3007/submitorder', form,{
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
        if(data){
          setLoading('none');
          showNotice(data.msg,data.result);
        }
      }else{
        showNotice('Error, ensure you\'ve filled all fields',false);
        setLoading('none');

      }
    }
    useEffect( () => { 
      async function fetchData() {
          try {
              const res = await axios.get('http://localhost:3007/cart',{withCredentials: true}); 
              let products = [];
              var t = 0;
              for(let i=0;i<res.data.length;i++){
                const p = await axios.get('http://localhost:3007/product?id='+res.data[i]);
                t = t + p.data.price;
                setTotal(t);
                products.push(p.data);
              }
              console.log(products);
              setCart(products);
          } catch (err) {
              console.log(err);
          }
      }
      fetchData();
  }, []);
    return (
        <div>         
            <div style={{display: noticeVisibility, backgroundColor: noticeType}} className="fixed top-0 w-full h-12 flex items-center text-white text-sm font-bold px-4 py-3" role="alert">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                <p>{noticeMsg}</p>
            </div>           
<form className="w-3/5 float-left inline-block px-4 py-6 sm:px-6">
  <div className="space-y-12">
    

    <div className="pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label for="first-name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('first-name',e.target.value)} name="first-name" id="first-name" autocomplete="given-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label for="last-name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('last-name',e.target.value)} name="last-name" id="last-name" autocomplete="family-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-4">
          <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div className="mt-2">
            <input id="email" onChange={(e)=>validateForm('email',e.target.value)} name="email" type="email" autocomplete="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label for="country" className="block text-sm font-medium leading-6 text-gray-900">Country</label>
          <div className="mt-2">
            <select id="country" onChange={(e)=>validateForm('country',e.target.value)} name="country" autocomplete="country-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        <div className="col-span-full">
          <label for="street-address" className="block text-sm font-medium leading-6 text-gray-900">Street address</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('street-address',e.target.value)} name="street-address" id="street-address" autocomplete="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
          <label for="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('city',e.target.value)} name="city" id="city" autocomplete="address-level2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label for="region" className="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('region',e.target.value)} name="region" id="region" autocomplete="address-level1" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label for="postal-code" className="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
          <div className="mt-2">
            <input type="text" onChange={(e)=>validateForm('zip',e.target.value)} name="postal-code" id="postal-code" autocomplete="postal-code" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
          </div>
        </div>
      </div>
    </div>

   
  </div>

  
</form>

                
                      <div className="w-2/5 inline-block overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                          <div className="ml-3 flex h-7 items-center">
                            
                          </div>
                        </div>
          
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.map((element,index)=> 
                              <>
                              <li key={index} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img src={element?.featuredImg} alt="" className="h-full w-full object-cover object-center"></img>
                                </div>
          
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href="#">{element?.title}</a>
                                      </h3>
                                      <p className="ml-4">${element?.price}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{element?.excerpt}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty 1</p>
          
                                    <div className="flex">
                                      <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                    </div>
                                  </div>
                                </div>
                              </li>                              
                              </>                              
                            )
                            }          
                            </ul>
                          </div>
                        </div>
                      </div>
          
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${total}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <button onClick={handleonclick} className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Order<div style={{display: loading}} role="status">
        <svg aria-hidden="true" className="ml-4 w-6 h-6 text-white-200 animate-spin dark:text-white-600 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div></button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or
                            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>                 
    )
}