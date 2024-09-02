import Mark from 'markup.min.njs';

function legacyIndexRender(r){
  function getMirDate(d){
    var result;
    if (d.last_update_ts) {
      var date = new Date(d.last_update_ts * 1000);
      if (date.getFullYear() > 2000) {
        result = `${('000'+date.getFullYear()).substr(-4)}-${('0'+(date.getMonth()+1)).substr(-2)}-${('0'+date.getDate()).substr(-2)}` +
          ` ${('0'+date.getHours()).substr(-2)}:${('0'+date.getMinutes()).substr(-2)}`;
      } else {
        result = "0000-00-00 00:00";
      }
    } else {
      result = d.last_update.replace(/(\d\d:\d\d):\d\d(\s\+\d\d\d\d)?/, '$1');
    }
    return result;
  }
  r.subrequest('/legacy_index.html', {
    args: '',
    body: '',
    method: 'GET'
  }, function(rTmpl){
    if(rTmpl.status != 200){
      return r.return(rTmpl.status);
    }
    var tmpl = rTmpl.responseText;
    
    r.subrequest('/static/njs/options.json', {
      args: '',
      body: '',
      method: 'GET'
    }, function(rOpt){
      if(rOpt.status != 200){
        return r.return(rOpt.status);
      }
      var global_options;
      try{
        global_options = JSON.parse(rOpt.responseText);
      }catch(e){
        return r.return(500);
      }
      var label_map = global_options.options.label_map;
      var new_mirrors = {};
      global_options.options.new_mirrors.forEach((m) => new_mirrors[m] = true);
      var unlisted = global_options.options.unlisted_mirrors;
      var force_help = {}
      global_options.options.force_redirect_help_mirrors.forEach((m) => force_help[m] = true);
      var descriptions = {};
      global_options.options.mirror_desc.forEach((m) => descriptions[m.name] = m.desc);
      r.subrequest('/static/tunasync.json', {
        args: '',
        body: '',
        method: 'GET'
      }, function(rMirs){
        var mirs = unlisted;
        if(rMirs.status == 200){
          try{
            mirs = mirs.concat(JSON.parse(rMirs.responseText));
          }catch(e){
          }
        }
        var renMirs = mirs.filter(m => m.status != "disabled" && m.is_master !== false).map(m => {
          var status = m.status;
          var target = m;
          if(m.link_to){
            var _target = mirs.filter(_m => _m.name == m.link_to)[0];
            if(_target){
              target = _target;
              status = target.status;
            }
          }
          return {
            status: status,
            name: m.name,
            description: descriptions[m.name],
            url: '/' + m.name + '/',
            is_new: !!new_mirrors[m.name],
            github_release: m.url && m.url.startsWith('/github-release/'),
            last_update: getMirDate(target),
            label: label_map[status],
            show_status: status != 'success'
          };
        });
        renMirs.sort((a, b) => a.name < b.name ? -1: 1 );
        var sponsors = {names: [], progress: 0, progressText: 0, total: 0, totalFormated: '', targetFormated: ''};
        r.subrequest('/mirror-sponsors.json', {
          args: '',
          body: '',
          method: 'GET'
        }, function(rSponsors){
          if(rSponsors.status == 200){
            try{
              var list = JSON.parse(rSponsors.responseText);
              sponsors.names = list;
              sponsors.total = list.length * 550
              sponsors.target = 27500
              sponsors.progressText = sponsors.total / sponsors.target * 100
              sponsors.progress = Math.min(sponsors.progressText, 100)
              sponsors.totalFormated = sponsors.total.toString().split('').reverse().join('').replace(/(\d{3})/gi, '$1,').split('').reverse().join('').replace(/^,*/gi, '$')
              sponsors.targetFormated = sponsors.target.toString().split('').reverse().join('').replace(/(\d{3})/gi, '$1,').split('').reverse().join('').replace(/^,*/gi, '$')
            }catch(e){
            }
          }
          var result = Mark.up(tmpl, {mirs: renMirs, sponsors});
          r.status = 200;
          r.headersOut['Content-Type'] = 'text/html';
          r.sendHeader();
          r.send(result);
          r.finish();
        })
      })
    })
  });
}

export default legacyIndexRender;
