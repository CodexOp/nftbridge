import React, {useState} from 'react';
import './swap.css';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import logo from '../../images/logo.png'


const Swap = () => {
  const [swap, setSwap] = useState(false)
  const [valve, setValve] = useState(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
  const [valve2, setValve2] = useState(<div className='swap_element'> <SiBinance /> BINANCE</div>)
 
  const swapping = () => {
    setSwap(!swap)

    if(swap === false){
      setValve(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
      setValve2(<div className='swap_element'> <SiBinance /> BINANCE</div>)
    }

    else{
      setValve(<div className='swap_element'> <SiBinance /> BINANCE</div>)
      setValve2(<div className='swap_element'> <FaEthereum /> ETHEREUM</div>)
    }
  }
  return (
      
    <div className='dash'>
        <div>
  <div className='navbar_outer'>
            
            <div className='logo_container'><img className="logo" alt="logo" src={logo} /><h2>METALOOP</h2></div>
            <div className='connect_wallet_container'>
                <button className='wallet' >CONNECT</button>
            </div>
        </div>
        </div>
    <div className='landing'>
        <div className='stak_box'>  
            <div className='stak_heading'>
                <h2>NFT BRIDGE</h2>
                <p>Swap your Token from ETH to BSC or Vice-Versa</p>
            </div>
        
            {/* <Timer /> */}
          

            <div className='inputs'>
            <div className='inputbox'>
            <div className="input_amount">
            <input placeholder='Amount To Transfer' type="number"  />
            <div className='max'>
                <p>MAX</p>
                </div>
                </div>
            <div className="input1">
                <div className='maxToken'>
                <p>{valve}</p>
                </div>
                </div>
                <div className='inputbox'>
                <div>
                  <BsFillArrowDownCircleFill className='swapp_arrow' onClick={() => swapping()}/>
                </div>
                <div className="input2">
                <div className='maxToken'>
                <p>{valve2}</p>
                </div>
                <input placeholder='Reciptent Address'  />

                </div>
            </div>
            </div>
            </div>


           
            <div className='all_buttons'>
                <button className='greenButton'>SWAP</button>
               
            </div>
            </div>
    </div>
    </div>
  )
}


export default Swap