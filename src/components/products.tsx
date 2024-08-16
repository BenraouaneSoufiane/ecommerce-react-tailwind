import { useState, useEffect } from 'react';
import axios from 'axios';

export default ()=>{
    const [loading, setLoading] = useState(["none","none","none","none"]);
    const [products, setProducts] = useState([]);
    const [showed, setShowed] = useState(false);
    const [noticeVisibility, setNoticeVisibility] = useState('none');
    const [noticeMsg, setNoticeMsg] = useState('');
    const [noticeType, setNoticeType] = useState('rgb(59 130 246)');
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
    const handleonclick = async(index)=>{
      let t = loading;
      t[index] = "block";
      setLoading({...t});
      const {data} = await axios.post('https://itstore.cryptocheckout.co/addtocart', {
        productId: index
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      if(data){
        t[index] = "none";
        setLoading({...t});
        showNotice(data.msg,data.result);
      }
    }
    useEffect( () => { 
        async function fetchData() {
            try {
                const res = await axios.get('https://itstore.cryptocheckout.co/products'); 
                setProducts(res.data);
                setShowed(true);
                //console.log(products);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);
    var addToCart = [];
    for(let i=0; i<4; i++){
      addToCart.push(showed && <button key={i} onClick={()=>handleonclick(i)} style={{backgroundColor:'black', float: 'right', height: '40px'}} className="inline-flex mt-4 items-center justify-center px-4 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"   >
      Add to Cart
      <div style={{display: loading[i]}} role="status">
        <svg aria-hidden="true" className="ml-4 w-6 h-6 text-white-200 animate-spin dark:text-white-600 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      </button>);
    }              
    return (
        <>
        <div className="bg-white">
          <div style={{display: noticeVisibility, backgroundColor: noticeType}} className="fixed top-0 w-full h-12 flex items-center text-white text-sm font-bold px-4 py-3" role="alert">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
            <p>{noticeMsg}</p>
          </div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
         
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">A service for every need</h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              
              {products.map((product, index)=>   
                <div className="group relative" key={index}>                
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img src={product?.featuredImg} alt={index} className="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
                  </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={"/product?id="+index} >
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {product?.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product?.excerpt}</p>

                  </div>
                  <p className="text-sm font-medium text-gray-900">${product?.price}</p>                  
                </div>

                </div>           
            
        )}
        
          {addToCart}              
          
          </div>
          </div>
        </div>
      </>   
    )
}