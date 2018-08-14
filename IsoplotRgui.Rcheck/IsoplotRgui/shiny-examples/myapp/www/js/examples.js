function example(geochronometer,plotdevice,format){
    switch (geochronometer) {
    case 'U-Pb':
	switch (format){
	case 1:
	    return({
		"data": {
		    "7/5":    [0.2819,0.2814,0.2814,0.2812,0.2814,0.2811,0.2813,0.281,0.2816,0.2554],
		    "s[7/5]": [0.00036,0.00092,0.00083,0.00061,0.00043,0.0008,0.00067,0.00057,0.00043,0.00041],
		    "6/8":    [0.03985,0.0398,0.03978,0.03976,0.03972,0.03971,0.03967,0.03966,0.03974,0.03607],
		    "s[6/8]": [0.00004,0.00004,0.0001,0.00005,0.00004,0.0001,0.00004,0.00006,0.00004,0.00005],
		    "rho":    [0.79,0.31,0.85,0.58,0.65,0.88,0.43,0.74,0.65,0.87],
		    "(C)":    []
		}
	    });
	case 2:
	    return({
		"data": {
		    "8/6":    [25.094,25.126,25.138,25.151,25.176,25.183,25.208,25.214,25.164,27.724],
		    "s[8/6]": [0.025,0.025,0.063,0.032,0.025,0.063,0.025,0.038,0.025,0.038],
		    "7/6":    [0.05131,0.05128,0.05131,0.05129,0.05139,0.05134,0.05143,0.05139,0.0514,0.05135],
		    "s[7/6]": [0.00004,0.00016,0.00008,0.00009,0.00006,0.00007,0.00011,0.00007,0.00006,0.00004],
		    "(rho)":  [],
		    "(C)":    []
		}
	    });
	case 3:
	    return({
		"data": {
		    "X=7/5":   [0.2819,0.2814,0.2814,0.2812,0.2814,0.2811,0.2813,0.281,0.2816,0.2554],
		    "s[7/5]":  [0.00036,0.00092,0.00083,0.00061,0.00043,0.0008,0.00067,0.00057,0.00043,0.00041],
		    "Y=6/8":   [0.03985,0.0398,0.03978,0.03976,0.03972,0.03971,0.03967,0.03966,0.03974,0.03607],
		    "s[6/8]":  [0.00004,0.00004,0.0001,0.00005,0.00004,0.0001,0.00004,0.00006,0.00004,0.00005],
		    "Z=7/6":   [0.05131,0.05128,0.05131,0.05129,0.05139,0.05134,0.05143,0.05139,0.0514,0.05135],
		    "s[7/6]":  [0.00004,0.00016,0.00008,0.00009,0.00006,0.00007,0.00011,0.00007,0.00006,0.00004],
		    "(rhoXY)": [],
		    "(rhoYZ)": [],
		    "(C)":     []
		}		
	    });
	case 4:
	    return({
		"data": {
		    "X=7/5":  [2.8229,2.6401,1.9623,2.5838,2.2208,4.3988,2.0326],
		    "s[7/5]": [0.0044,0.0041,0.0034,0.0049,0.0045,0.0049,0.005],
		    "Y=6/8":  [0.07022,0.068610,0.062320,0.06805,0.06482,0.084940,0.06321],
		    "s[6/8]": [0.00010,0.000090,0.000090,0.00012,0.00012,0.000080,0.00012],
		    "Z=4/8":  [0.0011468,0.0010625,0.0007508,0.0010323,0.0008678,0.0018790,0.0007820],
		    "s[4/8]": [0.0000020,0.0000018,0.0000016,0.0000022,0.0000018,0.0000024,0.0000020],
		    "rhoXY":  [0.90,0.89,0.82,0.90,0.93,0.84,0.79],
		    "rhoXZ":  [-0.89,-0.88,-0.82,-0.87,-0.94,-0.84,-0.85],
		    "rhoYZ":  [-0.82,-0.82,-0.69,-0.79,-0.93,-0.74,-0.79],
		    "(C)":    []
		}
	    });
	case 5:
	    return({
		"data": {
		    "X=8/6":  [14.24,14.575,16.045,14.695,15.428,11.773,15.821],
		    "s[8/6]": [0.020,0.020,0.023,0.025,0.029,0.011,0.031],
		    "Y=7/6":  [0.29168,0.27921,0.22845,0.2755,0.24861,0.37576,0.23333],
		    "s[7/6]": [0.00020,0.00020,0.00023,0.00023,0.00019,0.00023,0.00035],
		    "Z=4/6":  [0.016331,0.015486,0.012047,0.01517,0.013388,0.022121,0.012372],
		    "s[4/6]": [0.000016,0.000015,0.000018,0.00002,0.00001,0.000019,0.000019],
		    "rhoXY":  [0,0,0,0,0,0,0],
		    "rhoXZ":  [0,0,0,0,0,0,0],
		    "rhoYZ":  [-0.6,-0.6,-0.6,-0.6,-0.6,-0.6,-0.6],
		    "(C)":    []
		}
	    });
	case 6:
	    return({
		"data": {
		    "X=7/5":  [2.8229,2.6401,1.9623,2.5838,2.2208,4.3988,2.0326],
		    "s[7/5]": [0.0044,0.0041,0.0034,0.0049,0.0045,0.0049,0.005],
		    "Y=6/8":  [0.07022,0.068610,0.062320,0.06805,0.06482,0.084940,0.06321],
		    "s[6/8]": [0.00010,0.000090,0.000090,0.00012,0.00012,0.000080,0.00012],
		    "Z=4/8":  [0.0011468,0.0010625,0.0007508,0.0010323,0.0008678,0.0018790,0.0007820],
		    "s[4/8]": [0.0000020,0.0000018,0.0000016,0.0000022,0.0000018,0.0000024,0.0000020],
		    "Y=7/6":  [0.29168,0.27921,0.22845,0.2755,0.24861,0.37576,0.23333],
		    "s[7/6]": [0.00020,0.00020,0.00023,0.00023,0.00019,0.00023,0.00035],
		    "4/7":    [0.055989,0.055464,0.052734,0.055064,0.053851,0.05887,0.053024],
		    "s[4/7]": [0.000084,0.000084,0.000119,0.000107,0.000073,0.000078,0.000144],
		    "Z=4/6":  [0.016331,0.015486,0.012047,0.01517,0.013388,0.022121,0.012372],
		    "s[4/6]": [0.000016,0.000015,0.000018,0.00002,0.00001,0.000019,0.000019],
		    "(C)":    []
		}
	    });
	}
    case 'Pb-Pb':
	switch (format){
	case 1:
	    return({
		"data": {
		    "6/4":    [115,140.57,152.16,189.04,104.52,159.01,105.13,86.03,140.53,
			       106,67.36,88.03,807.75,849.62,276.78,210.66,428.82,38.22],
		    "s[6/4]": [0.4,1.36,0.9,1.47,0.92,3.24,0.34,0.8,1.05,0.29,
			       0.64,0.34,5.87,20.93,10.27,3.46,8.83,0.06],
		    "7/4":    [76.11,92.07,99.36,122.33,69.67,103.61,69.94,57.84,91.92,
			       70.37,46.23,59.39,510.73,535.81,177.28,135.59,271.14,28.16],
		    "s[7/4]": [0.25,0.85,0.57,0.92,0.58,2.03,0.22,0.5,0.66,0.18,
			       0.4,0.22,3.68,13.11,6.44,2.16,5.5,0.04],
		    "rho":    [0.9994,0.9999,0.9998,0.9999,0.9999,0.99998,0.9994,0.9999,0.9999,
			       0.9992,0.9999,0.9994,0.9999,0.99999,0.99999,0.99998,0.99999,0.9949],
		    "(C)":    []
		}
	    });
	case 2:
	    return({
		"data": {
		    "4/6":    [0.008696,0.007114,0.006572,0.00529,0.009568,0.006289,
			       0.009512,0.011624,0.007116,0.009434,0.014846,0.01136,
			       0.001238,0.001177,0.003613,0.004747,0.002332,0.026163],
		    "s[4/6]": [0.00003,0.000069,0.000039,0.000041,0.000084,0.000128,
			       0.000031,0.000108,0.000053,0.000026,0.00014,0.000044,
			       0.000009,0.000029,0.000134,0.000078,0.000048,0.000041],
		    "7/6":    [0.66182,0.65497,0.65302,0.64712,0.66664,0.65159,
			       0.66528,0.67228,0.65409,0.66387,0.68639,0.67462,
			       0.63228,0.63065,0.6405,0.64363,0.6323,0.73665],
		    "s[7/6]": [0.00014,0.00028,0.00017,0.00017,0.00033,0.0005,
			       0.00014,0.00043,0.00022,0.00012,0.00055,0.00019,
			       0.00008,0.00013,0.0005,0.00031,0.0002,0.00017],
		    "(rho)":  [0.848,0.967,0.909,0.919,0.975,0.989,0.855,0.982,0.946,
			       0.804,0.986,0.898,0.49,0.86,0.985,0.975,0.943,0.796],
		    "(C)":    []
		}
	    });
	case 3:
	    return({
		"data": {
		    "6/4":    [115,140.57,152.16,189.04,104.52,159.01,105.13,86.03,140.53,
			       106,67.36,88.03,807.75,849.62,276.78,210.66,428.82,38.22],
		    "s[6/4]": [0.4,1.36,0.9,1.47,0.92,3.24,0.34,0.8,1.05,0.29,
			       0.64,0.34,5.87,20.93,10.27,3.46,8.83,0.06],
		    "7/4":    [76.11,92.07,99.36,122.33,69.67,103.61,69.94,57.84,91.92,
			       70.37,46.23,59.39,510.73,535.81,177.28,135.59,271.14,28.16],
		    "s[7/4]": [0.25,0.85,0.57,0.92,0.58,2.03,0.22,0.5,0.66,0.18,
			       0.4,0.22,3.68,13.11,6.44,2.16,5.5,0.04],
		    "7/6":    [0.66182,0.65497,0.65302,0.64712,0.66664,0.65159,
			       0.66528,0.67228,0.65409,0.66387,0.68639,0.67462,
			       0.63228,0.63065,0.6405,0.64363,0.6323,0.73665],
		    "s[7/6]": [0.00014,0.00028,0.00017,0.00017,0.00033,0.0005,
			       0.00014,0.00043,0.00022,0.00012,0.00055,0.00019,
			       0.00008,0.00013,0.0005,0.00031,0.0002,0.00017],
		    "(C)":    []
		}		
	    });
	}
    case 'Ar-Ar': 
	switch (format){
	case 1:
	    return({
		"J":  [0.007608838,0.0000190],
		"data": {
		    "39/36":    [20.38, 26.46, 52.94, 83.1, 194.29, 203.3, 250.15, 219.3, 219.41, 183.26, 116.66],
		    "s[39/36]": [0.11, 0.08, 0.16, 0.58, 0.76, 0.89, 0.89, 1.52, 1.46, 0.56, 0.52],
		    "40/36":    [404.67, 419.11, 543.67, 672.05, 1189.64, 1222.05,
			         1442.44, 1298.97, 1305.19, 1137.37, 837.46],
		    "s[40/36]": [2.09, 1.25, 1.61, 4.64, 4.61, 5.35, 5.14, 9.01, 8.69, 3.43, 3.66],
		    "rho":      [0.959, 0.923, 0.939, 0.989, 0.976, 0.992, 0.992, 0.996, 0.997, 0.956, 0.98],
		    "(39)":     [0.042, 0.094, 0.282, 0.185, 0.27, 0.707, 0.719, 0.479, 0.5, 0.633, 0.405],
		    "(C)":      []
		}
	    });
	case 2:
	    return({
		"J":  [0.007608838,0.0000190],
		"data": {
		    "39/40":    [0.050356, 0.063141, 0.09737, 0.123648, 0.163314, 0.166361,
			         0.173424, 0.168825, 0.168109, 0.161126, 0.139306],
		    "s[39/40]": [0.000076, 0.000076, 0.000101, 0.000125, 0.000138, 0.000095,
				 0.00008, 0.000109, 0.000092, 0.000144, 0.000124],
		    "36/40":    [0.0024711, 0.002386, 0.0018394, 0.001488, 0.0008406, 0.0008183,
			         0.0006933, 0.0007698, 0.0007662, 0.0008792, 0.0011941],
		    "s[36/40]": [0.0000128, 0.0000071, 0.0000055, 0.0000103, 0.0000033,
				 0.0000036, 0.0000025, 0.0000053, 0.0000051, 0.0000027, 0.0000052],
		    "(rho)":    [],
		    "(39)":     [0.042, 0.094, 0.282, 0.185, 0.27, 0.707, 0.719, 0.479, 0.5, 0.633, 0.405],
		    "(C)":      []
		}
	    });
	case 3:
	    return({
		"J":  [0.007608838,0.0000190],
		"data": {
		    "39/40":    [0.05035597,0.06314063,
				 0.09736973,0.12364790,0.16331400,0.16636073,0.17342377,
				 0.16882484,0.16810922,0.16112593,0.13930648],
		    "s[39/40]": [0.00007579,0.00007635,
				 0.00010066,0.00012470,0.00013827,0.00009456,0.00008007,
				 0.00010857,0.00009152,0.00014445,0.00012351],
		    "36/40":    [0.00247113,0.00238603,
				 0.00183935,0.00148798,0.00084059,0.00081830,0.00069327,
				 0.00076984,0.00076617,0.00087922,0.00119408],
		    "s[36/40]": [0.00001278,0.00000711,
				 0.00000546,0.00001027,0.00000326,0.00000358,0.00000247,
				 0.00000534,0.00000510,0.00000265,0.00000522],
		    "39/36":    [20.37766953,26.46266599,
				 52.93697092,83.09764683,194.28512356,203.30059638,250.15196844,
				 219.29834304,219.41470909,183.26035451,116.66453524],
		    "s[39/36]": [0.10863816,0.08312922,
				 0.15734247,0.57839869,0.75988506,0.88895174,0.89357971,
				 1.52314302,1.45743969,0.55666518,0.51691077],
		    "(39)":     [0.0416012,0.0944759,0.2820416,0.1848611,0.2702872,0.7072563,
			  	 0.7188705,0.4792595,0.5001037,0.6326591,0.4050682],
		    "(C)":      []
		}
	    });
	}
    case 'Th-U':
	switch (format){
	case 1:
	    return({
		"data": {
		    "X=8/2":  [5.962, 3.546, 2.703, 2.236, 1.974, 1.811],
		    "s[8/2]": [0.166, 0.08, 0.056, 0.044, 0.037, 0.033],
		    "Y=4/2":  [6.588, 3.834, 2.807, 2.35, 2.071, 1.882],
		    "s[4/2]": [0.183, 0.087, 0.058, 0.046, 0.039, 0.034],
		    "Z=0/2":  [4.66, 2.831, 2.213, 1.817, 1.661, 1.562],
		    "s[0/2]": [0.114, 0.052, 0.034, 0.025, 0.021, 0.018],
		    "rhoXY":  [0.898, 0.87, 0.859, 0.856, 0.859, 0.863],
		    "rhoXZ":  [0.724, 0.594, 0.516, 0.46, 0.421, 0.393],
		    "rhoYZ":  [0.728, 0.597, 0.518, 0.462, 0.422, 0.394],
		    "(C)":    []
		}	
	    });
	case 2:
	    return({
		"data": {
		    "X=2/8":  [0.1677, 0.282, 0.3699, 0.4473, 0.5065, 0.552],
		    "s[2/8]": [0.0047, 0.0064, 0.0076, 0.0087, 0.0095, 0.01],
		    "Y=4/8":  [1.105, 1.0813, 1.0385, 1.0512, 1.049, 1.039],
		    "s[4/8]": [0.0139, 0.0125, 0.0113, 0.011, 0.0104, 0.0099],
		    "Z=0/8":  [0.7816, 0.7983, 0.8188, 0.8125, 0.8416, 0.862],
		    "s[0/8]": [0.0154, 0.0151, 0.015, 0.0146, 0.0148, 0.0149],
		    "rhoXY":  [0.2367, 0.2645, 0.2701, 0.2744, 0.2712, 0.2667],
		    "rhoXZ":  [0.514, 0.6284, 0.6905, 0.7275, 0.7606, 0.7836],
		    "rhoYZ":  [0.3348, 0.3182, 0.3043, 0.2972, 0.288, 0.2797],
		    "(C)":    []
		}
	    });
	case 3:
	    return({
		"data": {
		    "8/2":    [5.962, 3.546, 2.703, 2.236, 1.974, 1.811],
		    "s[8/2]": [0.166, 0.08, 0.056, 0.044, 0.037, 0.033],
		    "0/2":    [4.66, 2.831, 2.213, 1.817, 1.661, 1.562],
		    "s[0/2]": [0.114, 0.052, 0.034, 0.025, 0.021, 0.018],
		    "(rho)":  [0.728, 0.597, 0.518, 0.462, 0.422, 0.394],
		    "(C)":    []
		}	
	    });
	case 4:
	    return({
		"data": {
		    "2/8":    [0.1677, 0.282, 0.3699, 0.4473, 0.5065, 0.552],
		    "s[2/8]": [0.0047, 0.0064, 0.0076, 0.0087, 0.0095, 0.01],
		    "0/8":    [0.7816, 0.7983, 0.8188, 0.8125, 0.8416, 0.862],
		    "s[0/8]": [0.0154, 0.0151, 0.015, 0.0146, 0.0148, 0.0149],
		    "(rho)":  [0.3348, 0.3182, 0.3043, 0.2972, 0.288, 0.2797],
		    "(C)":    []
		}
	    });
	}
    case 'Rb-Sr':
	switch (format){
	case 1:
	    return({
		"data": {
		    "Rb87/Sr86":    [0.0312, 0.0536, 0.0316, 0.0327, 0.0271, 0.0149, 0.0238, 0.0074,
				     0.0176, 0.031, 0.0199, 0.0215, 0.0306, 0.034, 0.1705, 0.1289, 0.1278],
		    "s[Rb87/Sr86]": [0.0008, 0.0006, 0.001, 0.0008, 0.0004, 0.0002, 0.0007, 0.0004,
				     0.0011, 0.0006, 0.0005, 0.0006, 0.0013, 0.0008, 0.0008, 0.0006, 0.0006],
		    "Sr87/Sr86":    [0.70127,0.70243,0.70114,0.70112,0.7009,0.70011,0.70073,0.69972,
				     0.70047,0.70123,0.70048,0.70056,0.70102,0.70133,0.71008,0.70771,0.70753],
		    "s[Sr87/Sr86]": [0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,
				     0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001],
		    "(rho)":        [],
		    "(C)":          []
		}	
	    });
	case 2:
	    return({
		"data": {
		    "Rb":       [1.03,2.15,0.94,1.033,1.15,0.77,0.826,0.475,
			         0.49,1.22,1.02,1,1.21,1.13,10.1,6.36,6.33],
		    "s[Rb]":    [0.025,0.025,0.03,0.025,0.01,0.01,0.025,0.025,0.03,
			         0.025,0.025,0.03,0.05,0.025,0.045,0.03,0.03],
		    "Sr":       [95.6,116,86.1,91.4,122.9,149.9,100.4,185.8,80.6,
			         113.7,147.9,134.8,114.2,96,171.5,142.8,143.3],
		    "s[Sr]":    [0.1,0.15,0.15,0.1,1.2,1.5,0.2,0.15,
			         0.1,0.1,0.1,0.15,0.2,0.15,0.15,0.2,0.1],
		    "87/86":    [0.70127,0.70243,0.70114,0.70112,0.7009,0.70011,0.70073,0.69972,
			         0.70047,0.70123,0.70048,0.70056,0.70102,0.70133,0.71008,0.70771,0.70753],
		    "s[87/86]": [0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,
				 0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001],
		    "(C)":      []
		}
	    });
	}
    case 'Sm-Nd':
	switch (format){
	case 1:
	    return({
		"data": {
		    "Sm143/Nd144":    [0.18649,0.23209,0.24649,0.28153],
		    "s[Sm143/Nd144]": [0.0002,0.00024,0.00025,0.00029],
		    "Nd143/Nd144":    [0.51297,0.51417,0.51455,0.51545],
		    "s[Nd143/Nd144]": [0.00006,0.00001,0.00002,0.00003],
		    "(rho)":          [0.014,0.0023,0.0047,0.0058],
		    "(C)":            []
		}
	    });
	case 2:
	    return({
		"data": {
		    "Sm":         [4.173,27.41,48,39.12],
		    "s[Sm]":      [0.001,0.01,0.01,0.01],
		    "Nd":         [13.53895,71.47659,117.867,84.12472],
		    "s[Nd]":      [0.00001,0.00001,0.001,0.00001],
		    "143/144":    [0.51297,0.51417,0.51455,0.51545],
		    "s[143/144]": [0.00006,0.00001,0.00002,0.000025],
		    "(C)":        []
		}
	    });
	}
    case 'Re-Os':
	switch (format){
	case 1:
	    return({
		"data": {
		    "Re187/Os188":    [394.2,377.1,374.8,708.1,618.2,810.9,905.2,903.1],
		    "s[Re187/Os188]": [2.4,1.2,1.8,3.5,3.3,2.6,3,4.4],
		    "Os187/Os188":    [1.5438,1.4904,1.4856,2.3252,2.112,2.6146,2.8436,2.8319],
		    "s[Os187/Os188]": [0.0039,0.0064,0.0028,0.0054,0.0221,0.0046,0.0072,0.0052],
		    "(rho)":          [0.073,0.23,0.067,0.113,0.434,0.143,0.215,0.104],
		    "(C)":            []
		}
	    });
	case 2:
	    return({
		"data": {
		    "Re":         [13.36,13.2,16.98,32.7,49.81,44.25,47.09,47.16],
		    "s[Re]":      [0.08,0.04,0.08,0.16,0.24,0.14,0.15,0.23],
		    "Os":         [0.1939,0.1991,0.2575,0.2873,0.4903,0.3496,0.3409,0.3418],
		    "s[Os]":      [0.0006,0.0008,0.0007,0.0010,0.0035,0.0010,0.0013,0.0011],
		    "187/188":    [1.5438,1.4904,1.4856,2.3252,2.112,2.6146,2.8436,2.8319],
		    "s[187/188]": [0.0039,0.0064,0.0028,0.0054,0.0221,0.0046,0.0072,0.0052],
		    "(C)":        []
		}
	    });
	}
    case 'Lu-Hf':
	switch (format){
	case 1:
	    return({
		"data": {
		    "Lu176/Hf177":    [1.364,1.0095,0.5636,0.9697,0.5977,0.5877],
		    "s[Lu176/Hf177]": [0.011,0.0081,0.0045,0.0078,0.0048,0.0047],
		    "Hf176/Hf177":    [0.297717,0.293531,0.28876,0.293176,0.289264,0.289139],
		    "s[Hf176/Hf177]": [0.0000095,0.000019,0.0000085,0.000014,0.000016,0.000011],
		    "(rho)":          [],
		    "(C)":            []
		}
	    });
	case 2:
	    return({
		"data": {
		    "Lu":         [2.223,1.689,1.24,1.222,1.16,1.087],
		    "s[Lu]":      [0.011115,0.008445,0.0062,0.00611,0.0058,0.005435],
		    "Hf":         [0.233,0.239,0.314,0.18,0.277,0.264],
		    "s[Hf]":      [0.001165,0.001195,0.00157,0.0009,0.001385,0.00132],
		    "176/177":    [0.297717,0.293531,0.28876,0.293176,0.289264,0.289139],
		    "s[176/177]": [0.0000095,0.0000195,0.0000085,0.000014,0.0000155,0.000011],
		    "(C)":        []
		}
	    });
	}
    case 'U-Th-He':
	return({
	    "data": {
		"He":    [1.401,2.096,0.63,0.765,1.379,0.383,1.178,0.309,2.226,0.778,0.828],
		"s[He]": [0.211,0.315,0.095,0.115,0.208,0.058,0.181,0.047,0.342,0.117,0.134],
		"U":     [66.02,138.51,33.89,52.26,94.01,26.67,84.36,23.33,86.29,34.22,55.25],
		"s[U]":  [3.85,6,2,3.35,6.1,1.35,4.95,1.2,6.5,3.25,3.9],
		"Th":    [50.65,99.49,18.01,22.82,53.94,11.51,62.16,14.07,85.72,19.51,65.09],
		"s[Th]": [3.95,8.8,1.5,1.9,5.05,0.75,5.3,1.05,6.7,2.2,6.25],
		"Sm":    [],
		"s[Sm]": [],
		"(C)":   []
	    }
	});
    case 'fissiontracks':
	switch (format){
	case 1:
	    return({
		"age":  [100,1],
		"zeta": [350,10],
		"rhoD": [2500000,10000],
		"data": {
		    "Ns":  [38,48,114,13,25,49,39,18,26,24,55,38,
			    61,82,16,38,42,31,15,27,34,6,48,16,31],
		    "Ni":  [132,187,565,51,122,249,159,50,80,79,217,152,231,
			    347,75,135,186,123,61,107,135,43,215,52,165],
		    "(C)": []
		}
	    });
	case 2:
	    return({
		"age": [100,1],
		"zeta": [9700,50],
		"spotSize": 35,
		"data": {
		    "Ns": [38,48,114,13,25,49,39,18,26,24,55,38,
			   61,82,16,38,42,31,15,27,34,6,48,16,31],
		    "A": [4410,4410,4410,4410,4410,4410,4410,1470,2940,
			  1470,4410,2940,4410,4410,1470,2940,2940,4410,
			  1470,1470,2940,1470,1470,1470,4410],
		    "U1": [0.2848,0.4907,1.1073,0.1246,0.3064,0.7553,
			   0.6477,0.4525,0.6265,0.6665,0.5650,0.5624,
			   0.5469,1.1055,0.3365,0.8260,0.7490,0.2188,
			   0.5630,0.6939,0.5107,0.3732,1.5108,0.4085,0.4958],
		    "s[U1]": [0.0053,0.0070,0.0105,0.0035,0.0055,0.0087,
			      0.0080,0.0067,0.0079,0.0082,0.0075,0.0075,
			      0.0074,0.0105,0.0058,0.0091,0.0087,0.0047,
			      0.0075,0.0083,0.0071,0.0061,0.0123,0.0064,0.0070],
		    "U2": [0.4017,0.4491,1.7847,0.1575,0.2439,0.8813,0.3851,,
			   0.3733,,0.3496,0.6332,0.5620,0.6209,,0.5669,
			   0.7883,0.2904,,,0.4176,,,,0.3928],
		    "s[U2]": [0.0063,0.0067,0.0134,0.0040,0.0049,0.0094,
			      0.0062,,0.0061,,0.0059,0.0080,0.0075,0.0079,,
			      0.0075,0.0089,0.0054,,,0.0065,,,,0.0063],
		    "U3": [0.3680,0.4506,1.4605,0.1110,0.2414,0.7768,0.5782,,,,
			   0.6610,,0.6882,0.9559,,,,0.2018,,,,,,,0.3323],
		    "s[U3]": [0.0061,0.0067,0.0121,0.0033,0.0049,0.0088,0.0076,,,,
			      0.0081,,0.0083,0.0098,,,,0.0045,,,,,,,0.0058]
		}
	    });
	case 3:
	    return({
		"age": [100,1],
		"spotSize": 35,
		"data": {
		    "Ns": [38,48,114,13,25,49,39,18,26,24,55,38,
			   61,82,16,38,42,31,15,27,34,6,48,16,31],
		    "A": [4410,4410,4410,4410,4410,4410,4410,1470,2940,
			  1470,4410,2940,4410,4410,1470,2940,2940,4410,
			  1470,1470,2940,1470,1470,1470,4410],
		    "U1": [11.39,19.63,44.29,4.99,12.26,30.21,25.91,18.10,
			   25.06,26.66,22.60,22.50,21.88,44.22,13.46,33.04,
			   29.96,8.75,22.52,27.76,20.43,14.93,60.43,16.34,19.83],
		    "s[U1]": [0.21,0.28,0.42,0.14,0.22,0.35,0.32,0.27,0.32,
			      0.33,0.30,0.30,0.30,0.42,0.23,0.36,0.35,0.19,
			      0.30,0.33,0.29,0.24,0.49,0.26,0.28],
		    "U2": [16.07,17.96,71.39,6.30,9.76,35.25,15.40,,14.93,,13.98,
			   25.33,22.48,24.84,,22.67,31.53,11.62,,,16.70,,,,15.71],
		    "s[U2]": [0.25,0.27,0.53,0.16,0.20,0.38,0.25,,0.24,,0.24,
			      0.32,0.30,0.32,,0.30,0.36,0.22,,,0.26,,,,0.25],
		    "U3": [14.72,18.02,58.42,4.44,9.65,31.07,23.13,,,,
			   26.44,,27.53,38.24,,,,8.07,,,,,,,13.29],
		    "s[U3]": [0.24,0.27,0.48,0.13,0.20,0.35,0.30,,,,
			      0.33,,0.33,0.39,,,,0.18,,,,,,,0.23]
		}
	    });
	}
    case 'other': 
	switch (plotdevice){
	case 'regression':
	    return({
		"data": {
		    "X":    [194.2851236,203.3005964,250.1519684,
			     219.2983430,219.4147091,183.2603545],
		    "s[X]": [0.7598851,0.8889517,0.8935797,
			     1.5231430,1.4574397,0.5566652],
		    "Y":    [1189.6406096,1222.0457045,1442.4394536,
			     1298.9712148,1305.1933644,1137.3717613],
		    "s[Y]": [4.6136980,5.3463566,5.1391600,
			     9.0103220,8.6880016,3.4280785],
		    "rXY":  [0.9764073,0.9915557,0.9916286,
			     0.9957087,0.9966507,0.9561368],
		    "(C)":  []
		}
	    });
	case 'spectrum':
	    return({
		"data": {
		    "f":    [0.021,0.025,0.024,0.024,0.026,0.026,0.028,
			     0.029,0.430,0.052,0.091,0.136,0.076,0.012],
		    "X":    [4.4339,4.6771,4.6533,4.7417,4.7153,4.7080,4.7417,
			     4.7855,4.7863,4.7709,4.8116,4.7947,4.9116,4.5317],
		    "s[X]": [0.9350,0.1225,0.0964,0.0861,0.0776,0.0734,0.0717,
			     0.0677,0.0134,0.0388,0.0246,0.0207,0.0472,0.1952]
		}
	    });
	case 'radial':
	    return({
		"data": {
		    "t":    [14,14.1,14.1,17.4,18,18.9,19.2,20,20,20.1,20.6,20.9,
			     21.3,28.2,31.8,35.8,38.7,38.9,40.3,40.8,41,41.5,42.8,
			     44.5,44.8,45.7,45.8,46.3,49.1,50.5,50.6,54.6,55.2,58.7,
			     58.8,59.8,60.7,63,63.6,65.3,66.7,72,73,77.8,80.2,81.2,
			     81.4,91.8,153.1,195],
		    "s[t]": [2.3,2.05,3.65,3.15,3,3.4,4.15,3.1,3.45,4.6,3.25,3.6,
			     3.15,4.85,8.15,6,6.3,4.8,7.05,5.45,6.45,5.9,6,6.2,7.5,
			     6.75,5.85,7.15,5.25,9.3,7.5,9.35,10.95,8.85,7.05,11.85,
			     8.05,10.45,8.75,9.1,9.1,11.2,11.3,14.8,12.25,14.15,
			     14.5,15.4,27.7,31.45],
		    "(C)":  []
		}
	    });
	case 'average':
	    return({
		"data": {
		    "X":    [248.212,249.090,248.678,245.422,249.823,243.340,250.970,
			     249.276,250.055,251.202,252.467,250.100,249.804,252.118,
			     250.957,251.634,249.785,249.344,249.088,249.655,253.917,
			     247.279,253.803,249.719,246.785,252.170,252.728,249.526],
		    "s[X]": [2.919,1.027,1.606,1.532,2.146,2.922,2.151,2.908,1.973,
			     2.119,1.770,2.682,1.147,1.910,2.258,2.011,1.361,2.900,
			     1.687,2.251,2.723,1.582,2.986,2.064,2.878,1.068,1.509,1.159]
		}
	    });
	case 'KDE':
	case 'CAD':
	    return({
		"data": {
		    "X": [251.634,245.422,252.170,253.803,250.100,261.653,262.474,259.587,
			  249.090,249.785,263.984,260.336,246.785,256.235,249.088,249.804,
			  260.643,255.134,249.344,248.212,252.118,253.917,252.467,243.340,
			  249.719,247.279,249.823,248.678,252.541,252.728,254.567,249.526,
			  249.276,250.957,260.903,259.126,250.055,251.202,250.970,249.655,260.678]
		}
	    });
	}
    case 'detritals': return({
	"data": {
	    "A": ['N1',645.4,496.9,1000.3,1168.5,2263.5,1878.6,769.8,1161.7,519.4,1213.3,
		  271.3,1065.4,1114.6,998.7,603.3,465.9,489.4,744.5,1287.4,617,1802.8,1154.5,
		  511.3,583.8,209.5,987.4,1080.5,930.2,518.4,511,1109.7,1035.7,748.4,1068.2,
		  1079,995.8,1075.4,664.9,620.9,267.1,660,636.2,1089.8,637,598.8,1794.2,622.6,
		  566.5,543.5,1004.9,1013.3,604.4,663.4,645.1,475.1,128.9,564.9,2994.5,510.2,
		  629.5,1031.2,903.2,633.2,474.5,1073.1,549.2,1128.5,788.6,559.3,1246.1,979.2,
		  535.7,546.5,777.5,686,1040.1,1005.8,597.4,1805.8,1157.9,520.4,612.6,502.8,
		  538.1,832.8,1182.3,1187.1,1146,1142.5,1082.8,284.6,563.3,516.3,1366.4,1041.8,
		  1016.8,743,577.2,1110.6],
	    "B": ['N2',2764.6,1998.6,997.7,1105.5,620.6,1133.7,583.6,1216.6,1181.8,1203.7,
		  1251.2,1129.1,1078.9,897,1985.9,665.7,622,651.6,1075,629.9,557.6,1356.8,
		  1081.9,650.6,1351.4,666.2,1071.9,1087.2,1017.4,544.7,900.2,285.2,1100.6,668.3,
		  645.7,1059.6,564,623.5,1808.8,1226.4,1156.4,691.2,1849.8,1113,1144,555.1,1143,
		  1079.1,987.2,1117.7,706,678.7,647.9,1170.7,1041.2,999.5,773.3,1125,1123.5,
		  242.7,549.8,1162.7,1267.3,542.3,1033.6,1208.7,755.5,594.2,675.3,1431.3,973.5,
		  1124.3,836.9,739.5,603.1,751,1077.9,567.1,1766.1,596.4,613.6,1142.6,534.3,630,
		  665.1,1244.2,522.7,560.4,572.4,1586.2],
	    "C": ['N3',418.6,1036.1,1118.4,1221.4,944.7,937.8,982,752.6,1240.3,1278.2,1088.2,2041,
		  577.8,976.9,1411.5,547.5,791.5,2160.2,1043.6,1181.1,1229.2,1016.7,1148,1161,
		  1368.9,1862.5,993.5,1192.5,1659.6,503.5,967.7,2233.8,2441,1369,1502.1,684.7,
		  1028.6,1283.5,1289.1,1273.4,1086.7,1269,281.3,1816.1,1229.5,1331.2,1370.9,
		  1264.8,688.3,1741.1,1276.2,2106.1,665.1,2455.2,1211,1127.3,824.6,867.4,
		  210.9,1839.2,691.1,682.3,1190.1,639.9,1254.6,682.1,2068.2,583.7,769.1,1615.3,1150.5,
		  1283.5,1223,1054.1,1128.6,1980.7,1120.4,2312.2,1020.4,723.1,660.5,1105.6,1051.1,1687.5,1440.5,
		  625.8,1061.6,1504.2,777.5,1324,1374,1138.5,1172.2,1626.6,531.8,1065.6,1007.7,963.8,644.2,1865.9],
	    "D": ['N4',1228.4,1445.7,1400.5,1053.9,2073.4,1107.1,1386.1,1221.8,871,1418,1853.9,
		  2905.9,1928.9,728.5,1371.7,814.7,1527.4,1240.9,883.2,1244.6,1285.8,1230.5,1187.1,1400,1510.5,
		  1233.6,1875.6,1744.7,1387,1999,1917.7,1049,1726.6,1981.3,2069.6,1814.4,1106.3,699.1,1394.8,
		  2003.8,1113.8,760.1,1436.9,568.7,1343.9,1097,1156.3,1128.6,1039.4,875.5,549,1406.4,1431.6,
		  1408.3,1152.1,1284.8,648.1,1876.7,1373.6,554.2,519.9,1169.4,1914.7,1912.5,1380.2,1131.4,1688.5,
		  1801.5,1126.3,1894.9,1085.9,1070.7,1086.4,1224,985.3,675.8,2157.3,1823.7,1005.1,581.9,1005.7,
		  1284.9,1060.3,1890.7,1115.7,551.7,1006.2,1221.5,1015.7,1094,1019.2,650.2,722,515.8,970.6,1026.8,
		  1930.9,930.7,529.2,1138.9],
	    "E": ['N5',1227,1269.7,2127.1,1185.1,362.6,1114.6,701.2,1064.5,1133.7,938.7,991.8,
		  2039.6,1064.5,698.1,1507.9,668,1279.3,1386.9,1210.8,1368.3,761.2,1251.3,1539.3,1209.7,1334.7,
		  246.9,2036.3,1130.4,1778.5,663.6,525.4,553.9,1223.4,1053.1,1477.9,697.7,1834.8,1989.8,1177.5,
		  1480.8,1585.5,1521.8,1396.6,1210.4,1235.4,1292.5,1171.7,1216.4,2064.6,1322.2,1329.1,872.4,
		  2326.5,1372.3,1172.1,696,1360,1148.1,510.2,610.6,1301.8,1118.3,268.9,616.8,619.3,226.9,1788.9,
		  1408.2,567.9,1804.1,1180.3,660.1,553.7,560,638.5,943,1769.2,1773.5,673.6,1038.7,493.3,264,
		  1027.7,1730.4,375.9,2108.8,581.4,1950,672.1,1196.1,1920.7,1231.8,621.5,1111.6,1589.4,1798.8,
		  1995.4,1142.1,1223.8,554.5],
	    "F": ['N6',605.1,1462.6,1240.1,316.5,1524.5,1141.3,1521.5,1166.7,660.1,675.5,1211.4,
		  1391.2,2076.7,1430.9,576.9,1375.8,1278.6,1091,632,1867.4,885,1126.3,832.6,1158.2,2093.1,1185.2,
		  1289.5,597.3,1133.9,1418.6,1001.9,2074.3,1223.2,972.8,1469,638,1494,1107.9,2121.1,943,1216.2,
		  1148.6,1201.7,1548.5,1032.9,1260.6,605,1441.7,1547.1,713.1,1462.8,1101.6,858.7,1813.8,1233.1,
		  944.7,1302.4,541.4,3402,952.3,1027.7,1074,256.3,1195.9,1066.5,1092.7,1412.8,1005,1186,1042.9,
		  1281.8,1888.9,1560.6,1888,2193.3,1154.6,1196.3,809.9,1206.8,1042.8,1111,628.1,293,1094.6,
		  1920.5,1063.5,285.7,1929.9,1513.9,1302.6,1179.8,675.7,1040.6,511.9,529.5,1026.6,563.4,
		  1302.4,2858.8,1223.4],
	    "G": ['N7',931.2,980,1383.9,2017.4,1353.8,948.2,618.5,2104.7,307.2,2052.9,1977.3,
		  1064.2,703,1137.6,1325,583.8,1120.2,1989.2,1163.4,1145,1252.9,578.9,1032.2,1236.1,1151.1,1078.4,
		  475.5,993.6,1419.8,1303.7,958,702.1,966.1,1121.5,1808.7,1946.3,591.7,1984,2620.4,1031.2,768.3,
		  862.7,2061.1,1137.3,991,788.4,1092.2,1080.7,725.6,1098.4,1097.8,930.7,1134.6,1066.4,1139.9,
		  1007.2,1227.3,1345.8,1911,687.5,3208.7,2076.6,1153.1,1099.1,655.7,738.8,1416.9,1069.4,657.6,
		  1111.9,1218.1,1137.9,1060.6,1982.7,1976.7],
	    "H": ['N8',2440.3,1246.4,1131.9,1116.2,1985.7,1055.6,296.2,556.1,815.9,2266.4,
		  1094.6,634.9,981.3,1088,670.6,663.5,1767.5,533.7,510.3,1041.4,287.9,1991.1,1175.6,2036.1,
		  232.3,1276.8,588.6,573.4,1261,893.4,1484.6,262.6,1779.4,970.6,1521.5,2153.9,1142,1140.3,1037.3,
		  2004.8,2036.2,2079.3,554.8,931.3,997.2,573,1263.4,1299,981.6,859.2,606.5,1844.6,603.4,1014.8,
		  1056.3,1916.1,1263,558.1,1136.6,1199.3,1793.6,948.7,2086.5,520.6,600,1178.5,2059.2,1094.1,
		  1011.5,272.2,276.9,1156.8,545.3,1023.9,563.5,856.4,1108.5,1126.9,614.5,490.5,1839.8,1391.5,
		  578,632.6,555.6,545.7,1327.7,619.3,871,508.7,1128,1134.6,624.1,583.9,1916.7,1077.8,1205,261.8,
		  1064.8,1168.1],
	    "I": ['N9',2117.6,1919.1,640.9,679.7,732.3,1190.3,2005.4,529.7,2088.8,1584.3,995.4,
		  1069,1858.4,1157.4,215.9,602.5,1951.6,1175.2,1553.7,1307.2,627.8,1180.4,2951.4,1947.7,1467.5,
		  2634.6,1177.8,634.5,2102.9,2078.3,1717.9,1148.8,1137.6,675.8,991.4,377.1,773.3,1082.8,1479.5,
		  294.8,629.5,1076.4,1200.4,1266.1,1064.3,1067.4,1118.7,1147.7,641.6,1124.9,579.2,924,1158.7,
		  819.7,503,1061.2,2547.9,1498.8,281.7,2845.5,684.1,1175.2,607,1176.6,627.1,569.8,1202.2,1936.9,
		  1036.2,1176.4,862.9,1130.4,1729.7,565.2,1055.8,907.1,1827.7,692.1,1929.8,557.5,749.6,887.9,
		  2166.1,1028.7,3351.4,1842.3,1096.4,348.5,1299.9,1084.2,1169.6,1192.4,1353.7,2044,1102.7,1903.9,
		  831,1311.8,1916.6,1977],
	    "J": ['N10',2727.2,768,1294.2,1462.1,1924,1154.3,1350.8,538.5,1412.2,1577.6,2809.5,
		  659.3,1302.3,1135.8,973.3,1194.1,1157.1,811.5,1554.9,1948.5,582.1,1175.7,1493.8,1004.9,854.5,
		  1076.1,1811.6,978.6,1254.5,261.9,1265.6,1328.6,1026.5,1183.9,300.7,875.1,1383.9,701.5,624.7,
		  1253.9,1325.6,1554.6,1862.9,1445.5,747.1,552.6,1001.9,1094,1073.9,1010.4,632,1056.8,1951,1070,
		  883,498.4,1041.1,1123,1908,565.1,584.7,1152.5,1050.5,2088.2,1103.7,653.3,1028.2,1002.2,1233.8,
		  547.6,1413,1357.3,1323.3,1217.5,255.7,1221.8,1265.3,1092,1729.3,
		  1326.3,585.5,339.7,1229,628.3,1271.6],
	    "K": ['N11',555.8,997.7,1722.7,1225,240.3,1194.7,1144.5,1087.4,1209.1,1070.1,1126.3,
		  696.8,1603.3,1778.6,1019.2,1649.6,999.7,550.8,549.3,1017.2,1071.2,600.9,508.6,497.7,1050.3,505.5,
		  1005.8,1874.9,1202.4,603.2,1047.4,611.6,533.2,636,560.7,617.7,976.3,1081.7,1097.1,1747.7,1065.9,
		  1280,774.3,561.5,1041,1239.3,1217,1416.2,551.2,815.1,1111.4,1061.9,549.2,1033.4,526.5,1165.1,
		  2100,2666.9,1222.7,1738.7,547.3,1148.9,592.2,516.4,1093.5,193.3,288.3,1204.2,1155.3,270.9,544.3,
		  1052.7,552.6,533.7,1055.1,1148.6,601.8,616.5,1129.3,645.4,1098.8,1102.2,558.3,620.2,559.4,
		  1010.5,1925,774.6,1190.5,677.1,1220.1,676.1,2144.9,1141.7,1789.1,561,565.7,1087.8,608.6,623.9],
	    "L": ['N12',252.1,1008.9,502.2,501.4,1014.3,2731.1,1234,884.3,1858.6,1209.1,1075.3,
		  1034.5,1165.7,999.9,1111.8,226.9,772.3,903.3,1790,299.7,976.2,289.3,1253.5,644.5,1059.5,1261,
		  1986.3,1385.4,701.3,1051.6,550.2,583.2,1100.1,997.4,843.9,689.8,268.6,222,882.3,2680.6,1166.7,
		  1052.1,579.2,970.8,1136.5,2110.5,285.2,1411,1040.3,1214.9,1019.6,712.2,986.9,606.2,344.9,589.4,
		  1131.2,1028.2,602.9,535,1142,1682.2,1131.2,1874.3,616.3,855.9,585.6,278.6,664.3,1894.9,610.9,
		  1066.5,1604.3,2078,2547.9,569.4,970.9,808.7,1070.5,1020,1008.1,1108.1,1830.5,1062.3,1121.1,
		  567.1,1575.7,601.5,535.1,1085.4,1016.8,1977.5,632.6,1025.5,
		  1112.4,283.2,1013.9,485.5,1834.3,920.7],
	    "M": ['N13',2055.1,1106.9,1968.2,1131.2,1049,1053.2,1345.6,627.4,274.6,638.6,1137.3,
		  1003,1053.1,1014.2,1282.2,1754,1048.1,1198.1,517.3,591.2,660.3,1143.1,274.7,1155.2,1040.8,
		  1062.8,528.4,1022.9,1288.1,857.4,920.4,1168.5,814.2,1144.2,1059.7,781.3,524.2,1032.6,1751,
		  1034.8,1918.7,821.3,1058.2,814.1,1879.4,953.1,1034.5,1134.4,1063.3,1881.7,710.2,1035.4,622.5,
		  1148.4,970.5,1162.1,540,1117.7,1138.7,1092.3,912.7,565.5,813.6,605.9,1052.2,1158.8,1920.6,
		  1041.7,1732.7,2654.4,890.9,2096.5,947,1049.9,992.4,1000,930.5,1425.8,704.6,500.9,1090,1750.4,
		  1181,1193.3,1223.2,1127.4,548.9,1251.9,520.4,1101.5,1199.9,801.8,1110.4,1066.9,1552.4,1019.8,
		  1783.7,969,1913.8,1848.9],
	    "N": ['N14',1083.6,1847.5,1753.2,1022.5,1241.7,210.1,970.2,573.7,1114,1274.5,1022.2,
		  869.8,984.7,912.1,1183.3,1031.5,1025.5,1045,1045.7,605.9,627.6,1152.9,1071.3,913,1040.6,2826.3,
		  1249.3,1978.4,1034.2,1263.4,781,1083.8,501.3,624.4,1798,687.5,744.9,1162.8,1084.8,962.7,959.8,
		  835.9,1078.8,599.5,1372.7,901.6,1142.3,1091.1,581.5,1152.8,1045.9,1063.6,898.8,1082.3,975.9,
		  616.6,940,1948.4,976.3,697.5,1174.6,1308.1,856.4,296,1200.9,547.1,1093.4,1081.7,740,1007.9,
		  1311.6,669.5,1011.5,626.6,925.6,566,695.8,859.8,335.6],
	    "O": ['T8',254.7,1010.2,849,1744.9,969.7,935.4,1367.1,568.3,990.8,211.9,300.4,636.2,
		  1095.4,1051.2,1627,925.1,1007.7,1013.4,937,527.3,275.4,873.7,567.9,454.2,1008.8,1203.9,825,361.7,
		  1042.8,884.6,1065.4,1059.5,562.7,2934.8,1011.8,318.8,493.1,1051.5,306.7,1052,1001.9,990.1,559.1,
		  1261.9,274.6,1801.2,1049.5,1031.5,1205.8,1055.8,573.7,636.1,890.7,537.4,1851,1058.7,682.4,543.5,
		  385.3,1038,1803.5,1025.7,580.4,1031.6,1224.2,613.9,1741.3,1051.3,1008.1,1055.7,1740.6,1007.9,
		  1078.9,814.9,592.6,1067.4,1099.1,260.9,476,587.3,1783.4,503.5,574.3,574.7,999.8,2099.3,1239.1,
		  1069.2,834.7,587.5,305.7,1083.1,1071.1,279.8,545,542,796.6,3017.4,2261.8,575.5],
	    "P": ['T13',268,1051.2,1741,522.2,1152.5,1288.8,558.4,1072.4,530.7,475.5,641.3,1084,
		  531.4,848.1,768.4,925.5,535,765.7,1196.4,1326.6,1077,518.4,1077,566.8,1016.3,532.2,513.9,1631.4,
		  1021.2,1222.9,560.1,590.4,549.8,1966,1056.4,1066.4,1052.1,891.7,521,1268.8,960.2,3148.4,558.4,
		  1061.2,510.1,1097.6,673.8,509.2,1650.3,1038.6,502.3,1231,1049.6,1048.4,1891,521.4,1157.4,921.9,
		  986.5,1106.3,850.9,1097.1,283.2,2731,1094.1,978.5,1785.6,1098.3,1069.8,581.9,506.9,1066.8,526.1,
		  537.8,477.9,1145.1,2128.8,512.4,1192.5,590.5,1099.5,1836.4,662.9,997,1881.5,528.4,898.8,637.5,
		  260,1267.9,553.2,2759.3,276.2,525.7,1166.5,1046,1305.5,1097.6,930.5,542.6,409.4,703.6,521,
		  1906.7,1002.5,1215.5]
	}
    });
    default:
    }
}
