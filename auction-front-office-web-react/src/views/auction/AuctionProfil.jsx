import {Component, useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {Timer} from "../../components/Timer";
import global from "../../global.json";
import {Navigate, useLocation} from "react-router-dom";
import BidForm from "../../components/BidForm";
export default function AuctionProfil(props){
    const [slide,setSlide]=useState(0);
    const [data,setData]=useState(null);
    const [connected,setConnected]=useState(true);
    const location=useLocation();
    const auction=location.state;
    const user=JSON.parse(localStorage.getItem("user"));
    useEffect(()=>{
        if(user===null){
            alert("please log to see auction profil ")
            setConnected(false);
        }else {
            fetch(global.link+"/auctions/profile/"+auction.id,{
                headers:{
                    [global.tokenHeader]:user.data.token
                }
            })
                .then(result=> result.json())
                .then(data=>setData(data.data))
                .catch(err=>{
                    alert("please relog again , thanks")
                    setConnected(false)
                })
        }
    },[]);
        return(
            connected ?
                data !== null?
            <>
                <Navbar/>
                <main>
                    <div className="favourite-place place-padding">
                        <div className="container">
                            <div className="row">
                            </div>
                            <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-4"></div>
                                <div className="col-xl-6 col-lg-6 col-md-8">
                                    <div className="single-place mb-30">
                                        <div className="carousel slide" data-bs-ride="false" id="carousel-1">
                                            <div className="carousel-inner">
                                                {data.images.map(img=>
                                                    <div className="carousel-item active">
                                                        <img className="w-100 d-block" src={global.link+"/"+img.picPath} alt="Slide Image" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="place-cap">
                                            <div className="place-cap-top">
                                                <span><i className="fas fa-clock"></i><span><Timer expirationDate={Date.parse(data.endDate)} beginDate={Date.parse(data.beginDate)} /></span> </span>
                                                <h3>{auction.title}</h3>
                                                <p className="dolor">{data.product.category.name} <span>/ {data.product.name}</span></p>
                                                <p>{data.description}</p>
                                                <p>owner : {data.user.name}</p>
                                                <p>start price : {data.startPrice}</p>
                                                <p>current price : {data.max}</p>
                                                <h3 style={{color:"#ffa800"}}>Bids : </h3>
                                                <div className="table-responsive" style={{fontFamily: "Barlow Condensed",fontSize: 18,boxShadow: "1px 1px 16px #61616196",borderRadius:5}}>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>User</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            data.bids.map(bid =>

                                                                <tr>
                                                                    <td>{new Date(bid.bidDate).toDateString()}</td>
                                                                    <td>{bid.user.name}</td>
                                                                    <td>{bid.amount} Ar</td>
                                                                </tr>
                                                            )
                                                        }

                                                        </tbody>
                                                    </table>
                                                    </div>
                                                    {data.status === 1 ?
                                                    <BidForm auction={data} user={user.data} redirect={setConnected}/>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-4"></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer/>
            </>
            :
                    <div id="preloader-active">
                        <div className="preloader d-flex align-items-center justify-content-center">
                            <div className="preloader-inner position-relative">
                                <div className="preloader-circle"></div>
                                <div className="preloader-img pere-text">
                                    <img src="./assets/img/logo/laptop.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
            :
                <Navigate to={"/login"} />
        )
}