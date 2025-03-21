export const categories = ["Fiction","Drama","Humor","Politics","Philosophy","History","Adventure","Mystery"];
    
export const getViewableBookLink = (book) =>{
    if(!book?.formats) return null;

    const formatpriority = ["text/html","application/pdf","text/plain"];

    // check for format in order of priority

    for(const formatType of formatpriority){
        for(const [mime,url] of Object.entries(book.formats)){
            if(url.endsWith('.zip')) continue; //skipping zip files

            if(mime.startsWith(formatType)) return url;
        }
    }
    return null; //when no viewable format found
}