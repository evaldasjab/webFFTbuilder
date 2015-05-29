// Show tooltips - step by step tour

function showTooltipsTour() {
    
    // Instance the tour
    tour = new Tour({
        steps: [{
            // step 0
          element: '#button_upload_csv_file',
          title: 'Step 1:',
          content: 'Open a CSV file. The data should have headers and 1 or 0 values, interpreted as "yes" and "no".',
          placement: "bottom",
          //next: -1,
          //delay: 1000,
        },
        {  // step 1
          element: '#button_training_id',
          title: 'Optional:',
          content: 'Choose "Training", if you want to use half of the data to build the tree and later another half (choose "Testing") to cross-validate it.',
          placement: "bottom",
        },
        {  // step 2
          //element: '.criterion_label:first',
          element: '.criterion_label',
          title: 'Step 2:',
          content: 'Select one cue as CRITERION.',
          placement: "bottom",
        },
        {  // step 3
          element: '#blue_area .button_expand',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of any cue as single-cue tree. It gives a good hint, which cue to start from.',
          placement: "bottom",
        },
        {  // step 4
          element: '#button_expand_all_blue',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of ALL cues as single-cue trees. You can also do it for every cue individually.',
          placement: "right",
        },
        {  // step 5
          element: '#blue_area li:not(.ui-draggable-disabled) .widget_title',
          title: 'Step 3:',
          content: 'Choose a cue (any except the selected as criterion) and drag it to the tree area.',
          placement: "bottom",
        },
        {  // step 6
          element: '#tree0',
          title: 'Step 4:',
          content: 'Drop the cue in the tree area.',
          placement: "top",
        },
        {  // step 7
          element: '.trees .button_expand',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of the cue.',
          placement: "bottom",
        },
        {  // step 8
          element: '.button_stat',
          title: 'Helpful:',
          content: 'Switch statistics from this cue to the tree up to this cue. And back.',
          placement: "right",
        },
        {  // step 9
          element: '#button_expand_all_white',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of ALL cues.',
          placement: "right",
        },
        {  // step 10
          element: '#blue_area li:not(.ui-draggable-disabled) .widget_title',
          title: 'Step 5:',
          content: 'Choose another cue and drag it to the tree area.',
          placement: "bottom",
        },
        {  // step 11
          element: '#tree0',
          title: 'Step 6:',
          content: 'Drop the cue in the tree area, above or below existing cue(-s).',
          placement: "top",
        },
        {  // step 12
          delay: 500,
          element: '.exit_widget:first .button_close',
          title: 'Optional:',
          content: 'Click "X" to change the direction of the EXIT node. You can change it back anytime.',
          placement: "bottom",
        },
        {  // step 13
          element: '#white_area .widget .button_close:first',
          title: 'Optional:',
          content: 'Click "X" to remove the cue. You can drag it from the top shelf anytime again.',
          placement: "top",
        },
        {  // step 14
          element: '#tree1',
          title: 'Optional:',
          content: 'Drag and drop cues to the right tree area to make the second tree and compare the statistics.',
          placement: "top",
        },
        {  // step 15
          element: '#button_testing_id',
          title: 'Optional:',
          content: 'When you finish building the tree(-s), choose "Testing" to cross-validate it with the second half of the data.',
          placement: "bottom",
        },
        {  // step 16
          element: '.button_export:first',
          title: 'Optional:',
          content: 'You can export the created tree to Server for further analysis.',
          placement: "bottom",
        },
        {  // step 17
          element: '.button_help',
          title: "Have fun!",
          content: 'Click "?" to show these guiding tips.',
          placement: "right",
        }],
        
    });
    
    // Initialize the tour
    tour.init();
    
    console.log('TIPS RUNNING!');
}