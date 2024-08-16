import { useState, useEffect } from "react";
import axios from 'axios';
export default () => {
    
    const [total, setTotal] = useState(0);
    const [totalItems,setTotalItems] = useState(0);
    const [showed, setShowed] = useState(false);
    const [menuVisibility, setMenuVisiblily] = useState('none');
    const [cart, setCart] = useState([]);
    const handleonclick = function(){
        if(showed== false){
          setMenuVisiblily('flex');
          setShowed(true);
        }else{
          setMenuVisiblily('none');
          setShowed(false);
        }
    }
    useEffect( () => { 
      async function fetchData() {
          try {
              const res = await axios.get('https://itstore.cryptocheckout.co/cart',{withCredentials: true}); 
              let products = [];
              var t = 0;
              for(let i=0;i<res.data.length;i++){
                const p = await axios.get('https://itstore.cryptocheckout.co/getproduct?id='+res.data[i]);
                t = t + p.data.price;
                setTotalItems(res.data.length);
                setTotal(t);
                products.push(p.data);
              }
              //console.log(products);
              setCart(products);
              console.log(cart);
          } catch (err) {
              console.log(err);
          }
      }
      fetchData();
  }, []);
    return (
        <div>       
            <div className="ml-4 flow-root lg:ml-6">
              <button className="group -m-2 flex items-center p-2" onClick={handleonclick}>
                <svg className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{totalItems}</span>
                <span className="sr-only">items in cart, view bag</span>
              </button>
            </div>
            
            
                <div style={{display: menuVisibility,zIndex:9999}} className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  
                  <div className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                          <div className="ml-3 flex h-7 items-center">
                            <button type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500" onClick={handleonclick}>
                              <span className="absolute -inset-0.5"></span>
                              <span className="sr-only">Close panel</span>
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
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
                          <a href="/checkout" className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
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
                  </div>
                </div>
         </div>
    )
}