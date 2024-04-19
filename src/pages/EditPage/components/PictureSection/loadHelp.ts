import axios from "axios";

// w, h: for adjusting the width and height of a photo
// crop: for applying cropping to the photo
// fm: for converting image format
// auto=format: for automatically choosing the optimal image format depending on user browser
// q: for changing the compression quality when using lossy file formats
// fit: for changing the fit of the image within the specified dimensions
// dpr: for adjusting the device pixel ratio of the image

const ACCESS_KEY = "pV3slW8tpn9nsDJ-sivbAWCHj13h-M96ZHXzF5M0_ps";

export  class LoadUnsplashHelper {
    curPage = 1;
    nextPage = 1;
    collectionId="";
    curPerpage=10;

    constructor(collectionId:string,perPage?:number){
        this.collectionId = collectionId;
        this.curPerpage = perPage || 10
    }

    loadMoreData = () => {
        if(!this.collectionId){
            return  Promise.resolve([] as any) 
        }
        if(this.nextPage === this.curPage){
            this.nextPage = this.curPage + 1
            return new Promise((resolve,reject)=>{
                axios.get(`https://api.unsplash.com/collections/${this.collectionId}/photos`,{
                    params:{
                        client_id:ACCESS_KEY,
                        page: this.curPage,
                        per_page: this.curPerpage,
                        order_by:"latest"
                    }
                }).then((res)=>{
                    this.curPage = this.curPage + 1
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        }   
    };
}


export class LoadCollectionsHelper{
    curPage = 1;
    nextPage = 1;
    curPerpage=10;
    loadCollections = () => {
        if(this.nextPage === this.curPage){
            this.nextPage = this.curPage + 1
            return new Promise((resolve,reject)=>{
                axios.get('https://api.unsplash.com/collections',{
                    params:{
                        client_id:ACCESS_KEY,
                        page: this.curPage,
                        per_page: this.curPerpage,
                    }
                }).then((res)=>{
                    this.curPage = this.curPage + 1
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        }   
    };
}