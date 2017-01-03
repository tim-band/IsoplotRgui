$(function(){

    function initialise(){
	$('#OUTPUT').hide();
	$('#RUN').hide();
	$('#CSV').hide();
	var loader = new Image(); // preload image
	loader.src = "../images/loader.gif";
	var out = {
	    constants: null,
	    settings: null,
	    data: [],
	    optionschanged: false
	}
	var cfile = './js/constants.json';
	var sfile = './js/settings.json';
	$.getJSON(cfile, function(data){
	    out.constants = data;
	});
	$.getJSON(sfile, function(data){
	    out.settings = data;
	    selectGeochronometer();
	    out = populate(out,true);
	    $("#INPUT").handsontable({ // add change handler asynchronously
		afterChange: function(changes,source){
		    getData(0,0,0,0); // placed here because we don't want to
		    handson2json();   // call the change handler until after
		}                     // IsoplotR has been initialised
	    });
	});
	return out;
    };

    function dnc(){
	switch (IsoplotR.settings.geochronometer){
	case 'U-Pb':
	    return 6;
	case 'Ar-Ar':
	    switch(IsoplotR.settings.plotdevice){
		case 'spectrum':
		return 7;
		default:
		return 6;
	    }
	case 'fissiontracks':
	    var format = IsoplotR.settings.fissiontracks.format;
	    if (format<2){
		return 2;
	    } else {
		return 20;
	    }
	case 'Rb-Sr':
	case 'Sm-Nd':
	case 'Re-Os':
	    return 6;
	case 'U-Th-He':
	    return 8;
	case 'detritals':
	    var firstrow = $("#INPUT").handsontable('getData')[0];
	    var nc = firstrow.length;
	    for (var i=(nc-1); i>0; i--){
		if (firstrow[i]!=null) return i+1;
	    }
	case 'other':
	    switch(IsoplotR.settings.plotdevice){
	    case 'regression':
		return 5;
	    case 'spectrum':
		return 3;
	    case 'radial':
	    case 'average':
		return 2;
	    case 'KDE':
	    case 'CAD':
		return 1;
	    }
	}
	return 0;
    }

    function json2handson(settings){
	var geochronometer = settings.geochronometer;
	var json = settings.data[geochronometer];
	switch (geochronometer){
	case "Ar-Ar":
	    $("#Jval").val(json.J[0]);
	    $("#Jerr").val(json.J[1]);
	    break;
	case "fissiontracks":
	    if (settings.fissiontracks.format < 3){
		$("#zetaVal").val(json.zeta[0]);
		$("#zetaErr").val(json.zeta[1]);
	    }
	    if (settings.fissiontracks.format < 2){
		$("#rhoDval").val(json.rhoD[0]);
		$("#rhoDerr").val(json.rhoD[1]);
	    }
	    if (settings.fissiontracks.format > 1){
		$("#spotSizeVal").val(json.spotSize);
	    }
	    if (settings.plotdevice=='set-zeta'){
		$("#standAgeVal").val(json.age[0]);
		$("#standAgeErr").val(json.age[1]);
	    }
	    break;
	default:
	}
	var row, header;
	var handson = {
	    data: [],
	    headers: []
	};
	$.each(json.data, function(k, v) {
	    handson.headers.push(k);
	});
	var m = handson.headers.length; // number of columns
	var n = (m>0) ? json.data[handson.headers[0]].length : 0; // number of rows
	for (var i=0; i<handson.headers.length; i++){ // maximum number of rows
	    if (json.data[handson.headers[i]].length > n) {
		n = json.data[handson.headers[i]].length;
	}   }
	for (var i=0; i<n; i++){
	    row = [];
	    for (var j=0; j<m; j++){
		row.push(json.data[handson.headers[j]][i]);
	    }
	    handson.data.push(row);
	}
	handson.data.push([]); // add empty row in case json is empty
	$("#INPUT").handsontable({
	    data: handson.data,
	    colHeaders: handson.headers
	});
	// change headers for LA-ICP-MS-based fission track data
	if (geochronometer == 'fissiontracks' & settings.fissiontracks.format > 1){
	    var nc = $("#INPUT").handsontable('countCols');
	    var headers = ['Ns','A'];
	    for (var i=0; i<(nc-2)/2; i++){
		headers.push('U'+(i+1));
		headers.push('s[U'+(i+1)+']');		
	    }
	    $("#INPUT").handsontable({
		colHeaders: headers
	    });
	}
    }

    // overwrites the data in the IsoplotR preferences based on the handsontable
    function handson2json(){
	var out = $.extend(true, {}, IsoplotR); // clone
	var geochronometer = out.settings.geochronometer;
	var plotdevice = out.settings.plotdevice;
	var mydata = out.settings.data[geochronometer];
	switch (geochronometer){
	case "Ar-Ar":
	    mydata.J[0] = $("#Jval").val();
	    mydata.J[1] = $("#Jerr").val();
	    break;
	case "fissiontracks":
	    if (out.settings.fissiontracks.format < 3 &
		plotdevice != 'set-zeta'){
		mydata.zeta[0] = $("#zetaVal").val();
		mydata.zeta[1] = $("#zetaErr").val();
	    }
	    if (out.settings.fissiontracks.format < 2){
		mydata.rhoD[0] = $("#rhoDval").val();
		mydata.rhoD[1] = $("#rhoDerr").val();
	    }
	    if (out.settings.fissiontracks.format > 1){
		mydata.spotSize = $("#spotSizeVal").val();
	    }
	    if (plotdevice == 'set-zeta'){
		mydata.age[0] = $("#standAgeVal").val();
		mydata.age[1] = $("#standAgeErr").val();
	    }
	    break;
	default:
	}
	if (geochronometer=='detritals'){
	    $.each(mydata.data, function(k, v) {
		mydata.data[k] = null;
	    });
	    var labels = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
			  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	    var label = '';
	    for (var k=0; k<dnc(); k++){
		if (k<26) {
		    label = labels[k];
		} else {
		    label = labels[Math.floor((k-1)/26)] + labels[k%26];
		}
		mydata.data[label] = $("#INPUT").handsontable('getDataAtCol',k);
	    }
	} else {
	    var i = 0;
	    $.each(mydata.data, function(k, v) {
		mydata.data[k] = $("#INPUT").handsontable('getDataAtCol',i++);
	    });
	}
	out.settings.data[geochronometer] = mydata;
	out.optionschanged = false;
	IsoplotR = out;
    }

    function getData(r,c,r2,c2){
	var geochronometer = IsoplotR.settings.geochronometer;
	var FTformat = IsoplotR.settings.fissiontracks.format;
	var nr = 1+Math.abs(r2-r);
	var nc = 1+Math.abs(c2-c);
	var dat = [];
	var DNC = dnc();
	var cond1 = (nc < DNC);
	var cond2 = (geochronometer=='other') & (nr==1);
	var cond3 = geochronometer=='detritals';
	var cond4 = (cond1 & !cond3);
	var cond9 = geochronometer=='fissiontracks';
	var cond10 = FTformat>1;
	var cond11 = (cond9 & cond10);
	if (cond1|cond2) {
		nc = DNC;
		nr = $("#INPUT").handsontable('countRows');
		r = 0;
		c = 0;
		r2 = nr-1;
		c2 = nc-1;
	}
	dat = $("#INPUT").handsontable('getData',r,c,r2,c2);
	if (cond1|cond3|cond11){
	    var clean = [];
	    for (var i=0; i<nr; i++){
		var row = [];
		var good = false;
		for (var j=0; j<nc; j++){
		    if (dat[i][j]==null){
			row.push('');
		    } else {
			row.push(dat[i][j]);
			good = true;
		    }
		}
		if (good) {
		    clean.push(row);
		}
	    }
	    dat = clean;
	}
	if (geochronometer=='Ar-Ar'){
	    var J = $('#Jval').val();
	    var sJ = $('#Jerr').val();
	    IsoplotR.data = [nr,nc,J,sJ,dat];
	} else if (geochronometer=='fissiontracks' & FTformat==1){
	    var zeta = $('#zetaVal').val();
	    var zetaErr = $('#zetaErr').val();
	    var rhoD = $('#rhoDval').val();
	    var rhoDerr = $('#rhoDerr').val();
	    IsoplotR.data = [nr,nc,zeta,zetaErr,rhoD,rhoDerr,dat];
	} else if (geochronometer=='fissiontracks' & FTformat==2){
	    var zeta = $('#zetaVal').val();
	    var zetaErr = $('#zetaErr').val();
	    var spotSize = $('#spotSizeVal').val();
	    IsoplotR.data = [nr,nc,zeta,zetaErr,spotSize,dat];
	} else if (geochronometer=='fissiontracks' & FTformat==3){
	    var spotSize = $('#spotSizeVal').val();
	    IsoplotR.data = [nr,nc,spotSize,dat];
	} else {
	    IsoplotR.data = [nr,nc,dat];
	}
    }
    
    function showSettings(option){
	var set = IsoplotR.settings[option];
	var cst = IsoplotR.constants;
	switch (option){
	case 'U-Pb':
	    $('.show4UPb').show();
	    $('.hide4UPb').hide();
	    $('#U238U235').val(cst.iratio.U238U235[0]);
	    $('#errU238U235').val(cst.iratio.U238U235[1]);
	    $('#LambdaU238').val(cst.lambda.U238[0]);
	    $('#errLambdaU238').val(cst.lambda.U238[1]);
	    $('#LambdaU235').val(cst.lambda.U235[0]);
	    $('#errLambdaU235').val(cst.lambda.U235[1]);
	    break;
	case 'Ar-Ar':
	    $('.show4ArAr').show();
	    $('.hide4ArAr').hide();
	    $('#Ar40Ar36').val(cst.iratio.Ar40Ar36[0]),
	    $('#errAr40Ar36').val(cst.iratio.Ar40Ar36[1]),
	    $('#LambdaK40').val(cst.lambda.K40[0]),
	    $('#errLambdaK40').val(cst.lambda.K40[1]),
	    $('#i2iArAr').prop('checked',set.i2i=='TRUE');
	    break;
	case 'Re-Os':
	    $('.show4ReOs').show();
	    $('.hide4ReOs').hide();
	    $('#Os184Os192').val(cst.iratio.Os184Os192[0]);
	    $('#errOs184Os192').val(cst.iratio.Os184Os192[1]);
	    $('#Os186Os192').val(cst.iratio.Os186Os192[0]);
	    $('#errOs186Os192').val(cst.iratio.Os186Os192[1]);
	    $('#Os187Os192').val(cst.iratio.Os187Os192[0]);
	    $('#errOs187Os192').val(cst.iratio.Os187Os192[1]);
	    $('#Os188Os192').val(cst.iratio.Os188Os192[0]);
	    $('#errOs188Os192').val(cst.iratio.Os188Os192[1]);
	    $('#Os189Os192').val(cst.iratio.Os189Os192[0]);
	    $('#errOs189Os192').val(cst.iratio.Os189Os192[1]);
	    $('#Os190Os192').val(cst.iratio.Os190Os192[0]);
	    $('#errOs190Os192').val(cst.iratio.Os190Os192[1]);
	    $('#LambdaRe187').val(cst.lambda.Re187[0]);
	    $('#errLambdaRe187').val(cst.lambda.Re187[1]);
	    $('#i2iReOs').prop('checked',set.i2i=='TRUE');
	    break;
	case 'U-Th-He':
	    $('.show4UThHe').show();
	    $('.hide4UThHe').hide();
	    $('#U238U235').val(cst.iratio.U238U235[0]);
	    $('#errU238U235').val(cst.iratio.U238U235[1]);
	    $('#LambdaU238').val(cst.lambda.U238[0]);
	    $('#errLambdaU238').val(cst.lambda.U238[1]);
	    $('#LambdaU235').val(cst.lambda.U235[0]);
	    $('#errLambdaU235').val(cst.lambda.U235[1]);
	    $('#LambdaTh232').val(cst.lambda.Th232[0]);
	    $('#errLambdaTh232').val(cst.lambda.Th232[1]);
	    $('#LambdaSm147').val(cst.lambda.Sm147[0]);
	    $('#errLambdaSm147').val(cst.lambda.Sm147[1]);
	    break;
	case 'fissiontracks':
	    $('.show4fissiontracks').show();
	    $('.hide4fissiontracks').hide();
	    if (set.format==1){
		$('.show4EDM').show();
		$('.hide4EDM').hide();
	    } else if (set.format==2){
		$('.show4ICP').show();
		$('.hide4ICP').hide();
	    } else if (set.format==3){
		$('.show4absolute').show();
		$('.hide4absolute').hide();
	    }
	    $('#FT-options option[value='+set.format+']').
		prop('selected', 'selected');
	    $('#U238U235').val(cst.iratio.U238U235[0]);
	    $('#errU238U235').val(cst.iratio.U238U235[1]);
	    $('#LambdaU238').val(cst.lambda.U238[0]);
	    $('#errLambdaU238').val(cst.lambda.U238[1]);
	    $('#LambdaFission').val(cst.lambda.fission[0]);
	    $('#errLambdaFission').val(cst.lambda.fission[1]);
	    var mineral = set.mineral;
	    $('#mineral-option option[value='+mineral+']').
		prop('selected', 'selected');
	    $('#etchfact').val(cst.etchfact[mineral]);
	    $('#tracklength').val(cst.tracklength[mineral]);
	    $('#mindens').val(cst.mindens[mineral]);
	    break;
	case 'detritals':
	    $('.show4detritals').show();
	    $('.hide4detritals').hide();
	    $('#headers-on').prop('checked',set.format==1);
	    break;
	case 'other':
	    $('.show4other').show();
	    $('.hide4other').hide();
	    break;
	case 'concordia':
	    $('#tera-wasserburg').prop('checked',set.wetherill!='TRUE');
	    $('#conc-age-option option[value='+set.showage+']').
		prop('selected', 'selected');
	    $('#mint').val(set.mint);
	    $('#maxt').val(set.maxt);
	    $('#alpha').val(set.alpha);
	    $('#exterr').prop('checked',set.exterr=='TRUE');
	    $('#shownumbers').prop('checked',set.shownumbers=='TRUE');
	    $('#sigdig').val(set.sigdig);
	    break;
	case 'isochron':
	    $('#inverse').prop('checked',set.inverse=='TRUE');
	    $('#isochron-exterr').prop('checked',set.exterr=='TRUE')	    
	case 'regression':
	    $('#shownumbers').prop('checked',set.shownumbers=='TRUE');
	    $('#exterr').prop('checked',set.exterr=='TRUE');
	    $('#isochron-minx').val(set.minx);
	    $('#isochron-maxx').val(set.maxx);
	    $('#isochron-miny').val(set.miny);
	    $('#isochron-maxy').val(set.maxy);
	    $('#alpha').val(set.alpha);
	    $('#sigdig').val(set.sigdig);
	    break;
	case 'radial':
	    $('#transformation option[value='+set.transformation+']').
		prop('selected', 'selected');
	    $('#mixtures option[value='+set.numpeaks+']').
		prop('selected', 'selected');
	    $('#mint').val(set.mint);
	    $('#t0').val(set.t0);
	    $('#maxt').val(set.maxt);
	    $('#sigdig').val(set.sigdig);
	    $('#pch').val(set.pch);
	    $('#cex').val(set.cex);
	    $('#bg').val(set.bg);
	    $('#cutoff76').val(set.cutoff76);
	    $('#mindisc').val(set.mindisc);
	    $('#maxdisc').val(set.maxdisc);
	    break;
	case 'average':
	    $('#exterr').prop('checked',set.exterr=='TRUE');
	    $('#outliers').prop('checked',set.outliers=='TRUE');
	    $('#alpha').val(set.alpha);
	    $('#sigdig').val(set.sigdig);
	    $('#cutoff76').val(set.cutoff76);
	    $('#mindisc').val(set.mindisc);
	    $('#maxdisc').val(set.maxdisc);
	    break;
	case 'spectrum':
	    $('#exterr').prop('checked',set.exterr=='TRUE');
	    $('#plateau').prop('checked',set.plateau=='TRUE');
	    $('#alpha').val(set.alpha);
	    $('#sigdig').val(set.sigdig);
	    break;
	case 'KDE':
	    $('#showhist').prop('checked',set.showhist=='TRUE');
	    $('#adaptive').prop('checked',set.adaptive=='TRUE');
	    $('#samebandwidth').prop('checked',set.samebandwidth=='TRUE');
	    $('#normalise').prop('checked',set.normalise=='TRUE');
	    $('#log').prop('checked',set.log=='TRUE');
	    $('#minx').val(set.minx);
	    $('#maxx').val(set.maxx);
	    $('#bandwidth').val(set.bandwidth);
	    $('#binwidth').val(set.binwidth);
	    $('#pchdetritals').val(set.pchdetritals);
	    $('#pch').val(set.pch);
	    $('#cutoff76').val(set.cutoff76);
	    $('#mindisc').val(set.mindisc);
	    $('#maxdisc').val(set.maxdisc);
	    break;
	case 'CAD':
	    $('#verticals').prop('checked',set.verticals=='TRUE');
	    $('#pch').val(set.pch);
	    $('#cutoff76').val(set.cutoff76);
	    $('#mindisc').val(set.mindisc);
	    $('#maxdisc').val(set.maxdisc);
	    break;
	case 'set-zeta':
	    $('.show4zeta').show();
	    $('.hide4zeta').hide();
	    $('#exterr').prop('checked',set.exterr=='TRUE');
	    $('#sigdig').val(set.sigdig);
	    break;
	case 'ages':
	    if (geochronometer != 'U-Th-He') {
		$('#age-exterr').prop('checked',set.exterr=='TRUE');
	    }
	    $('#sigdig').val(set.sigdig);
	    break;
	case 'MDS':
	    $('#classical').prop('checked',set.classical=='TRUE');
	    $('#shepard').prop('checked',set.shepard=='TRUE');
	    $('#nnlines').prop('checked',set.nnlines=='TRUE');
	    $('#ticks').prop('checked',set.ticks=='TRUE');
	    $('#pch').val(set.pch);
	    $('#cex').val(set.cex);
	    $('#pos').val(set.pos);
	    $('#col').val(set.col);
	    $('#bg').val(set.bg);
	    break;
	case 'helioplot':
	    $('#logratio').prop('checked',set.logratio=='TRUE');
	    $('#shownumbers').prop('checked',set.shownumbers=='TRUE');
	    $('#showcentralcomp').prop('checked',set.showcentralcomp=='TRUE');
	    $('#alpha').val(set.alpha);
	    $('#sigdig').val(set.sigdig);
	    $('#minx').val(set.minx);
	    $('#maxx').val(set.maxx);
	    $('#miny').val(set.miny);
	    $('#maxy').val(set.maxy);
	    $('#fact').val(set.fact);
	    break;
	default:
	}
    }

    function recordSettings(){
	var plotdevice = IsoplotR.settings.plotdevice;
	var geochronometer = IsoplotR.settings.geochronometer;
	var pdsettings = IsoplotR.settings[plotdevice];
	var gcsettings = IsoplotR.constants;
	switch (plotdevice){
	case 'concordia':
	    pdsettings.wetherill =
		$('#tera-wasserburg').prop('checked') ? 'FALSE' : 'TRUE';
	    pdsettings["showage"] = $('#conc-age-option').prop("value");
	    pdsettings.mint =
		isValidAge($('#mint').val()) ? $('#mint').val() : 'auto';
	    pdsettings.maxt =
		isValidAge($('#maxt').val()) ? $('#maxt').val() : 'auto';
	    if ($('#alpha').val() > 0 & $('#alpha').val() < 1) { 
		pdsettings.alpha = $('#alpha').val(); 
	    }
	    pdsettings.exterr = 
		$('#exterr').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.shownumbers =
		$('#shownumbers').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.sigdig = $('#sigdig').val();
	    break;
	case 'isochron':
	    pdsettings.inverse = $('#inverse').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.exterr = $('#isochron-exterr').prop('checked') ? 'TRUE' : 'FALSE';
	case 'regression':
	    pdsettings.shownumbers = $('#shownumbers').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.minx = $('#isochron-minx').val();
	    pdsettings.maxx = $('#isochron-maxx').val();
	    pdsettings.miny = $('#isochron-miny').val();
	    pdsettings.maxy = $('#isochron-maxy').val();
	    pdsettings.alpha = $('#alpha').val();
	    pdsettings.sigdig = $('#sigdig').val();
	    break;
	case 'radial':
	    pdsettings.transformation =
		$('option:selected', $("#transformation")).attr('value');
	    pdsettings.mint = $('#mint').val();
	    pdsettings.t0 = $('#t0').val();
	    pdsettings.maxt = $('#maxt').val();
	    pdsettings.sigdig = $('#sigdig').val();
	    pdsettings.pch = $('#pch').val();
	    pdsettings["cex"] = $('#cex').val();
	    pdsettings.bg = $('#bg').val();
	    pdsettings.cutoff76 = $('#cutoff76').val();
	    pdsettings.mindisc = $('#mindisc').val();
	    pdsettings.maxdisc = $('#maxdisc').val();
	    break;
	case 'average':
	    if (geochronometer != "other"){
		pdsettings.exterr =
		    $('#exterr').prop('checked') ? 'TRUE' : 'FALSE';
	    }
	    pdsettings["outliers"] = 
		$('#outliers').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.alpha = $('#alpha').val();
	    pdsettings.sigdig = $('#sigdig').val();
	    pdsettings["cutoff76"] = $('#cutoff76').val();
	    pdsettings["mindisc"] = $('#mindisc').val();
	    pdsettings["maxdisc"] = $('#maxdisc').val();
	    break;
	case 'spectrum':
	    if (geochronometer != "other"){
		pdsettings.exterr =
		    $('#exterr').prop('checked') ? 'TRUE' : 'FALSE';
	    }
	    pdsettings["plateau"] = 
		$('#plateau').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.alpha = $('#alpha').val();
	    pdsettings.sigdig = $('#sigdig').val();
	    break;
	case 'KDE':
	    pdsettings["showhist"] = 
		$('#showhist').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["adaptive"] = 
		$('#adaptive').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["samebandwidth"] = 
		$('#samebandwidth').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["normalise"] = 
		$('#normalise').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["log"] = 
		$('#log').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["minx"] = $('#minx').val();
	    pdsettings["maxx"] = $('#maxx').val();
	    pdsettings["bandwidth"] = $('#bandwidth').val();
	    pdsettings["binwidth"] = $('#binwidth').val();
	    pdsettings["pchdetritals"] = $('#pchdetritals').val();
	    pdsettings["pch"] = $('#pch').val();
	    pdsettings["cutoff76"] = $('#cutoff76').val();
	    pdsettings["mindisc"] = $('#mindisc').val();
	    pdsettings["maxdisc"] = $('#maxdisc').val();
	    break;
	case 'CAD':
	    pdsettings["pch"] = $('#pch').val();
	    pdsettings["verticals"] = 
		$('#verticals').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["cutoff76"] = $('#cutoff76').val();
	    pdsettings["mindisc"] = $('#mindisc').val();
	    pdsettings["maxdisc"] = $('#maxdisc').val();
	    break;
	case 'set-zeta':
	    IsoplotR.settings.data[geochronometer].age[0] = $('#standAgeVal').val();
	    IsoplotR.settings.data[geochronometer].age[1] = $('#standAgeErr').val();
	    pdsettings.exterr = 
		$('#exterr').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.sigdig = $('#sigdig').val();
	    break;
	case 'MDS':
	    pdsettings["classical"] =
		$('#classical').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["shepard"] =
		$('#shepard').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["nnlines"] =
		$('#nnlines').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["ticks"] =
		$('#ticks').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["pch"] = $('#pch').val();
	    pdsettings["cex"] = $('#cex').val();
	    pdsettings["pos"] = $('#pos').val();
	    pdsettings["col"] = $('#col').val();
	    pdsettings["bg"] = $('#bg').val();
	    break;
	case 'ages':
	    if (geochronometer != 'U-Th-He'){
		pdsettings.exterr = $('#age-exterr').prop('checked') ? 'TRUE' : 'FALSE';
	    }
	    pdsettings.sigdig = $('#sigdig').val();
	case 'helioplot':
	    pdsettings.logratio = 
		$('#logratio').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.shownumbers = 
		$('#shownumbers').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings.showcentralcomp = 
		$('#showcentralcomp').prop('checked') ? 'TRUE' : 'FALSE';
	    pdsettings["alpha"] = $('#alpha').val();
	    pdsettings["sigdig"] = $('#sigdig').val();
	    pdsettings["minx"] = $('#minx').val();
	    pdsettings["maxx"] = $('#maxx').val();
	    pdsettings["miny"] = $('#miny').val();
	    pdsettings["maxy"] = $('#maxy').val();
	    pdsettings["fact"] = $('#fact').val();
	    break;
	default:
	}
	switch (geochronometer){
	case 'U-Pb':
	    gcsettings.iratio.U238U235[0] = $("#U238U235").val();
	    gcsettings.iratio.U238U235[1] = $("#errU238U235").val();
	    gcsettings.lambda.U238[0] = $("#LambdaU238").val();
	    gcsettings.lambda.U238[1] = $("#errLambdaU238").val();
	    gcsettings.lambda.U235[0] = $("#LambdaU235").val();
	    gcsettings.lambda.U235[1] = $("#errLambdaU235").val();
	    break;
	case 'Ar-Ar':
	    gcsettings.iratio.Ar40Ar36[0] = $("#Ar40Ar36").val();
	    gcsettings.iratio.Ar40Ar36[1] = $("#errAr40Ar36").val();
	    gcsettings.lambda.K40[0] = $("#LambdaK40").val();
	    gcsettings.lambda.K40[1] = $("#errLambdaK40").val();
	    IsoplotR.settings[geochronometer].i2i = 
		$("#i2iArAr").prop('checked') ? "TRUE" : "FALSE";
	    break;
	case 'Re-Os':
	    gcsettings.iratio.Os184Os192[0] = $('#Os184Os192').val();
	    gcsettings.iratio.Os184Os192[1] = $('#errOs184Os192').val();
	    gcsettings.iratio.Os186Os192[0] = $('#Os186Os192').val();
	    gcsettings.iratio.Os186Os192[1] = $('#errOs186Os192').val();
	    gcsettings.iratio.Os187Os192[0] = $('#Os187Os192').val();
	    gcsettings.iratio.Os187Os192[1] = $('#errOs187Os192').val();
	    gcsettings.iratio.Os188Os192[0] = $('#Os188Os192').val();
	    gcsettings.iratio.Os188Os192[1] = $('#errOs188Os192').val();
	    gcsettings.iratio.Os189Os192[0] = $('#Os189Os192').val();
	    gcsettings.iratio.Os189Os192[1] = $('#errOs189Os192').val();
	    gcsettings.iratio.Os190Os192[0] = $('#Os190Os192').val();
	    gcsettings.iratio.Os190Os192[1] = $('#errOs190Os192').val();
	    gcsettings.lambda.Re187[0] = $('#LambdaRe187').val();
	    gcsettings.lambda.Re187[1] = $('#errLambdaRe187').val();
	    IsoplotR.settings[geochronometer].i2i = 
		$("#i2iReOs").prop('checked') ? "TRUE" : "FALSE";
	    break;
	case 'U-Th-He':
	    gcsettings.iratio.U238U235[0] = $("#U238U235").val();
	    gcsettings.iratio.U238U235[1] = $("#errU238U235").val();
	    gcsettings.lambda.U238[0] = $("#LambdaU238").val();
	    gcsettings.lambda.U238[1] = $("#errLambdaU238").val();
	    gcsettings.lambda.U235[0] = $("#LambdaU235").val();
	    gcsettings.lambda.U235[1] = $("#errLambdaU235").val();
	    gcsettings.lambda.Th232[0] = $("#LambdaTh232").val();
	    gcsettings.lambda.Th232[1] = $("#errLambdaTh232").val();
	    gcsettings.lambda.Sm147[0] = $("#LambdaSm147").val();
	    gcsettings.lambda.Sm147[1] = $("#errLambdaSm147").val();
	    break;
	case 'detritals':
	    IsoplotR.settings[geochronometer].format = 
		$("#headers-on").prop('checked') ? 1 : 2;
	    break;
	case 'fissiontracks':
	    var mineral = $('#mineral-option').prop('value');
	    IsoplotR.settings[geochronometer].mineral = mineral;
	    IsoplotR.settings[geochronometer].format = 
		1*$('option:selected', $("#FT-options")).attr('value');
	    gcsettings.iratio.U238U235[0] = $("#U238U235").val();
	    gcsettings.iratio.U238U235[1] = $("#errU238U235").val();
	    gcsettings.lambda.U238[0] = $("#LambdaU238").val();
	    gcsettings.lambda.U238[1] = $("#errLambdaU238").val();
	    gcsettings.etchfact[mineral] = $("#etchfact").val();
	    gcsettings.tracklength[mineral] = $("#tracklength").val();
	    gcsettings.mindens[mineral] = $("#mindens").val();
	    break;
	default:
	}
    }

    function setSelectedMenus(options){
	$("#Rb-Sr").prop('disabled',true);
	$("#U-series").prop('disabled',true);
	$("#concordia").prop('disabled',options[0]);
	$("#helioplot").prop('disabled',options[1]);
	$("#isochron").prop('disabled',options[2]);
	$("#radial").prop('disabled',options[3]);
	$("#regression").prop('disabled',options[4]);
	$("#spectrum").prop('disabled',options[5]);
	$("#average").prop('disabled',options[6]);
	$("#KDE").prop('disabled',options[7]);
	$("#CAD").prop('disabled',options[8]);
	$("#set-zeta").prop('disabled',options[9]);
	$("#MDS").prop('disabled',options[10]);
	$("#ages").prop('disabled',options[11]);
	for (var i=0; i<12; i++){ // change to first available option
	    if (!options[i]) {
		$('#plotdevice').prop('selectedIndex',i);
		IsoplotR.settings.plotdevice = 
		    $('option:selected', $("#plotdevice")).attr('id');
		break;
	    }
	}
    }
    
    function changePlotDevice(){
	var gc = IsoplotR.settings.geochronometer;
	var opd = IsoplotR.settings.plotdevice; // old plot device
	var npd = $('option:selected', $("#plotdevice")).attr('id');
	IsoplotR.settings.plotdevice = npd;
	IsoplotR.optionschanged = false;
	$('#myscript').empty();
        if (npd == 'ages'){
	    $('#PLOT').hide();
	    $('#PDF').hide();
	    $('#RUN').show();
	    $('#CSV').show();
        } else if (npd == 'set-zeta') {
	    $('#PLOT').hide();
	    $('#PDF').hide();
	    $('#RUN').show();
	    $('#CSV').hide();    
	} else {
	    $('#PLOT').show();
	    $('#PDF').show();
	    $('#RUN').hide();
	    $('#CSV').hide();
        }
	if (npd == "spectrum" | opd == "spectrum" | gc == "other"){
	    populate(IsoplotR,true);
	} else {
	    populate(IsoplotR,false);
	}
	if (gc == 'fissiontracks' & npd == 'set-zeta'){
	    $(".show4zeta").show();
	    $(".hide4zeta").hide();
	} else if (gc == 'fissiontracks' & opd == 'set-zeta'){
	    $(".show4zeta").hide();
	    $(".hide4zeta").show();
	}
    }

    function selectGeochronometer(){
	var geochronometer = IsoplotR.settings.geochronometer;
	var plotdevice = IsoplotR.settings.plotdevice;
	$("#Jdiv").hide();
	$("#zetaDiv").hide();
	$("#rhoDdiv").hide();
	$("#spotSizeDiv").hide();
	switch (geochronometer){
	case 'U-Pb':
	    setSelectedMenus([false,true,true,false,true,true,
			      false,false,false,true,true,false]);
	    break;
	case 'Ar-Ar':
	    setSelectedMenus([true,true,false,false,true,false,
			      false,false,false,true,true,false]);
	    $("#Jdiv").show();
	    break;
	case 'Re-Os':
	case 'Rb-Sr':
	case 'Sm-Nd':
	    setSelectedMenus([true,true,false,false,true,true,
			      false,false,false,true,true,false]);
	    break;
	case 'U-Th-He':
	    setSelectedMenus([true,false,true,false,true,true,
			      false,false,false,true,true,false]);
	    break;
	case 'fissiontracks':
	    var format = IsoplotR.settings.fissiontracks.format;
	    setSelectedMenus([true,true,true,false,true,true,
			      false,false,false,false,true,false]);
	    if (format < 3){ $("#zetaDiv").show(); }
	    if (format < 2){ $("#rhoDdiv").show(); }
	    if (format > 1){ $("#spotSizeDiv").show(); }
	    break;
	case 'U-series':
	    setSelectedMenus([true,true,true,true,true,true,
			      true,true,true,true,true,true]);
	    break;
	case 'detritals':
	    setSelectedMenus([true,true,true,true,true,true,
			      true,false,false,true,false,true]);
	    break;
	case 'other':
	    setSelectedMenus([true,true,true,false,false,false,
			      false,false,false,true,true,true]);
	    break;
	default:
	    setSelectedMenus([true,true,true,true,true,true,
			      true,true,true,true,true,true]);
	}
	IsoplotR = populate(IsoplotR,false);
	$("#plotdevice").selectmenu("refresh");
    }

    // populate the handsontable with stored data
    function populate(prefs,forcedefaults){
	var geochronometer = prefs.settings.geochronometer;
	var plotdevice = prefs.settings.plotdevice;
	var data = prefs.settings.data[geochronometer];
	if (forcedefaults | $.isEmptyObject(data)){
	    if (geochronometer=='fissiontracks'){
		var format = prefs.settings[geochronometer].format;
		prefs.settings.data[geochronometer] =
		    example(geochronometer,plotdevice,format);
	    } else {
		prefs.settings.data[geochronometer] =
		    example(geochronometer,plotdevice);
	    }
	}
	json2handson(prefs.settings);
	return prefs;
    }

    function run(){
	if (IsoplotR.optionschanged){
	    recordSettings();
	    IsoplotR.optionschanged = false;
	} else {
	    handson2json();
	}
	if (IsoplotR.data.length==0) getData(0,0,0,0);
	Shiny.onInputChange("data",IsoplotR.data);
	Shiny.onInputChange("Rcommand",getRcommand(IsoplotR));
    }

    $.chooseNumRadialPeaks = function(){
	IsoplotR.settings.radial.numpeaks =
	    $('option:selected', $("#mixtures")).attr('value');	
    }
    
    $.chooseTransformation = function(){
	IsoplotR.settings.radial.transformation =
	    $('option:selected', $("#transformation")).attr('value');
    }
    
    $.chooseFTmethod = function(){
	var geochronometer = IsoplotR.settings.geochronometer;
	var plotdevice = IsoplotR.settings.plotdevice;
	var format = 1*$('option:selected', $("#FT-options")).attr('value');
	IsoplotR.settings[geochronometer].format = format;
	switch (format){
	case 1:
	    $(".show4EDM").show();
	    $(".hide4EDM").hide();
	    break;
	case 2:
	    $(".show4ICP").show();
	    $(".hide4ICP").hide();
	    break;
	case 3:
	    $(".show4absolute").show();
	    $(".hide4absolute").hide();
	    break;
	}
	if (plotdevice == 'set-zeta'){
	    $(".show4zeta").show();
	    $(".hide4zeta").hide();
	}
	IsoplotR = populate(IsoplotR,true);
    }
    
    $.chooseMineral = function(){
	var cst = IsoplotR.constants;
	var mineral = $('option:selected', $("#mineral-option")).val();
	switch (mineral){
	case 'apatite':
	    $("#etchfact").val(cst.etchfact[mineral]);
	    $("#tracklength").val(cst.tracklength[mineral]);
	    $("#mindens").val(cst.mindens[mineral]);
	    break;
	case 'zircon':
	    $("#etchfact").val(cst.etchfact[mineral]);
	    $("#tracklength").val(cst.tracklength[mineral]);
	    $("#mindens").val(cst.mindens[mineral]);
	    break;
	}
    }
    
    $(".button").button()

    $("#INPUT").handsontable({
	data : [[]],
	minRows: 100,
	minCols: 26,
	rowHeaders: true,
	colHeaders: true,
	contextMenu: true,
	observeChanges: true,
	manualColumnResize: true,
	afterSelectionEnd: function (r,c,r2,c2){
	    getData(r,c,r2,c2);
	}
    });

    $("#OUTPUT").handsontable({
	data : [[]],
	minRows: 100,
	minCols: 26,
	rowHeaders: true,
	colHeaders: true,
	contextMenu: true,
	observeChanges: false,
	manualColumnResize: true
    });
    
    $("select").selectmenu({ width : 'auto' });
    $("#geochronometer").selectmenu({
	change: function( event, ui ) {
	    IsoplotR.settings.geochronometer =
		$('option:selected', $("#geochronometer")).attr('id');
	    selectGeochronometer();
	}
    });
    $("#plotdevice").selectmenu({
	change: function( event, ui ) { changePlotDevice(); },
	focus: function( event, ui ) { changePlotDevice(); }
    });
    
    $("#helpmenu").dialog({ autoOpen: false });
    
    $('body').on('click', 'help', function(){
	var text = help($(this).attr('id'));
	$("#helpmenu").html(text);
	$("#helpmenu").dialog('open');
    });

    $("#OPEN").on('change', function(e){
	var file = e.target.files[0];
	var reader = new FileReader();
	reader.onload = function(e){
	    IsoplotR = JSON.parse(this.result);
	    var set = IsoplotR.settings;
	    $("#" + set.geochronometer ).prop("selected",true);
	    $("#geochronometer").selectmenu("refresh");
	    selectGeochronometer()
	    json2handson(set);
	}
	reader.readAsText(file);
    });

    $("#SAVE").click(function( event ) {
	var fname = prompt("Please enter a file name", "IsoplotR.json");
	if (fname != null){
	    handson2json();
	    $('#fname').attr("href","data:text/plain," + JSON.stringify(IsoplotR));
	    $('#fname').attr("download",fname);
	    $('#fname')[0].click();
	}
    });

    $("#OPTIONS").click(function(){
	var plotdevice = IsoplotR.settings.plotdevice;
	var geochronometer = IsoplotR.settings.geochronometer;
	var fname = "";
	$("#OUTPUT").hide();
	$("#myplot").show();
	$("#myplot").load("../options/index.html",function(){
	    fname = "../options/" + geochronometer + ".html";
	    $("#geochronometer-options").load(fname,function(){
		fname = "../options/" + plotdevice + ".html";
		$("#plotdevice-options").load(fname,function(){
		    showSettings(geochronometer);
		    showSettings(plotdevice);
		    IsoplotR.optionschanged = true;
		});
	    });
	});
    });

    $("#HELP").click(function(){
	var plotdevice = IsoplotR.settings.plotdevice;
	var geochronometer = IsoplotR.settings.geochronometer;
	var fname = "";
	$("#OUTPUT").hide();
	$("#myplot").show();
	fname = "../help/" + geochronometer + ".html";
	$("#myplot").load(fname,function(){
	    if (geochronometer=='Ar-Ar'){
		if (plotdevice=='spectrum'){
		    $('.show4ArArSpectrum').show();
		}
	    } else if (geochronometer=='fissiontracks'){
		var format = IsoplotR.settings.fissiontracks.format;
		if (format==1){
		    $('.show4EDM').show();
		} else if (format==2){
		    $('.show4ICP').show();
		} else if (format==3){
		    $('.show4absolute').show();
		}
		if (IsoplotR.settings.plotdevice=='set-zeta'){
		    $('.show4zeta').show();
		    $('.hide4zeta').hide();
		}
	    } else if (geochronometer=='other'){
		if (plotdevice=='radial'){
		    $('.show4radial').show();
		} else if (plotdevice=='regression'){
		    $('.show4regression').show();
		} else if (plotdevice=='spectrum'){
		    $('.show4spectrum').show();
		} else if (plotdevice=='average'){
		    $('.show4weightedmean').show();
		} else if (plotdevice=='KDE'){
		    $('.show4kde').show();
		} else if (plotdevice=='CAD'){
		    $('.show4cad').show();
		}
	    }
	});
    });

    
    $("#DEFAULTS").click(function(){
	var cfile = './js/constants.json';
	$.getJSON(cfile, function(data){
	    IsoplotR.constants = data;
	});
	IsoplotR = populate(IsoplotR,true);
    });

    $("#CLEAR").click(function(){
	$("#INPUT").handsontable({
	    data: [[]]
	});
	$("#OUTPUT").handsontable({
	    data: [[]]
	});
    });

    $("#PLOT").click(function(){
	$("#myplot").load("loader.html");
	$("#OUTPUT").hide();
	$("#myscript").empty();
	run();
    });

    $("#RUN").click(function(){
	$("#myplot").load("loader.html");
	$("#OUTPUT").handsontable('clear');
	$("#OUTPUT").show();
	$("#myscript").empty();
	run();
	$("#myplot").empty();
    });

    var IsoplotR = initialise();

});