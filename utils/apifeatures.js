class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

   

    this.query = this.query.find({...keyword });
    return this;
  }

  filter() {
   
   const copyquery  ={...this.queryStr}
  
                                                                                                                                                                                                                                                                                                                                                                                                                                                               
   const removeFields = ["keyword","page","limit"];
   removeFields.forEach((key)=>{ delete copyquery[key]})

   //to filter price 
  let querystr=JSON.stringify(copyquery)
 querystr= querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)
  

  this.query = this.query.find(JSON.parse(querystr));
 
return this;
    }
  
  pagination(resultperpage){
    const currentpage=Number(this.queryStr.page) || 1
    const skip=resultperpage * (currentpage-1)
    this.query=this.query.limit(resultperpage).skip(skip)
    return this;
  
  }
}
module.exports = Apifeatures;
