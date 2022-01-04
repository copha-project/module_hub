export = multer

declare function multer(params:any): any {
    
}

declare namespace multer {
    function single(params:any): any
    function diskStorage(params:any): any
}