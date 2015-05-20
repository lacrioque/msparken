var template_worker = function(template_id, template_obj){
    var template = $('#'+template_id).html(),
        obj = template_obj,
        html = "",
        prepare = function(){
            Mustache.parse(template);
        },
        render = function(){
            html = Mustache.render(template, obj);
        };
    
    prepare();
    render();
    
    return {
        changeData : function(template_obj){ obj = template_obj; render(); },
        changeID : function(template_id) { template = $('#'+template_id).html(); prepare(); render(); },
        getHTML : function(){ return html; }    
    };
};