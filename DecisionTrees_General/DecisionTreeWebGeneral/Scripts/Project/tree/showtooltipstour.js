// Show tooltips - step by step tour

function showTooltipsTour() {
    
    // Instance the tour
    tour = new Tour({
        steps: [{
           // step 0
          element: '#button_load_csv_sample-button',
          title: 'Step 1 of 5:',
          content: 'Open a CSV file or choose one of the CSV sample datasets.',
          placement: "right",
          //next: -1,  // hide the "next" button
          //delay: 1000,
        },
        {  // step 1
          element: '.criterion_label:first',
          title: 'Step 2 of 5:',
          content: 'Select one cue as CRITERION.',
          placement: "bottom",
        },
        {  // step 2
          element: '#blue_area .widget_head:eq(1) .widget_title',
          title: 'Step 3 of 5:',
          content: 'Choose a cue (any except the selected as criterion) and drag it to the tree area below.',
          placement: "top",
        },
        {  // step 3
          element: '#drophere_tree0:not(.disabled)',
          title: 'Step 4 of 5:',
          content: 'Drop the cue in the tree area.',
          placement: "right",
        },
        {  // step 4
          element: '#blue_area .widget_head:eq(2) .widget_title',
          title: 'Step 5 of 5:',
          content: 'Drag and drop another cue to the tree area, above or below the existing cue.',
          placement: "top",
        },
        {  // step 5
          //delay: 500,
          element: '.trees .widget:first',
          //orphan: true,
          title: 'Congratulations!!!',
          content: 'You have built your first Fast-and-Frugal Tree! Click "Next" to see optional and helpful features.',
          placement: "top",
        },
        {  // step 6
          //delay: 500,
          element: '.exit_widget:first .button_switch',
          title: 'Optional:',
          content: 'Click "<" or ">" to switch the direction of the EXIT node. You can change it back anytime.',
          placement: "bottom",
        },
        {  // step 7
          element: '#white_area .widget .button_close:first',
          title: 'Optional:',
          content: 'Click "X" to remove the cue. You can drag it from the top shelf anytime again.',
          placement: "top",
        },
        {  // step 8
          element: '#button_training:not(.disabled)',
          title: 'Optional:',
          content: 'Choose "Training", if you want to use half of the data to build the tree and later another half (choose "Testing") to cross-validate it.',
          placement: "bottom",
        },
        {  // step 9
          element: '#button_testing:not(.disabled)',
          title: 'Optional:',
          content: 'When you finish building the tree(-s), choose "Testing" to cross-validate it with the second half of the data.',
          placement: "bottom",
        },
        {  // step 10
          element: '#blue_area .button_expand:eq(1)',
          title: 'Helpful:',
          content: 'Click "V" to show & hide the split of cue&#8242s values and statistics of any cue as single-cue tree. It gives a good hint, which the cue is efficient.',
          placement: "bottom",
        },
        {  // step 11
          element: '#blue_area .ui-slider-handle:eq(1)',
          title: 'Optional:',
          content: 'Use the slider or enter a value in the field to set the split value, which will divide cue&#8242s values to "yes" or "no".',
          placement: "top",
        },
        {
          // step 12
          element: '#blue_area .button_swap:eq(1):visible',
          title: 'Optional:',
          content: 'Click the arrow to swap "yes" and "no" of the divided ranges of cue&#8242s values.',
          placement: "bottom",
        },
        {  // step 13
          element: '#button_expand_all_blue:not(.disabled)',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of ALL cues as single-cue trees. You can also do it for every cue individually.',
          placement: "right",
        },
        {  // step 14
          element: '.trees .button_expand:first',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of the cue in the tree.',
          placement: "bottom",
        },
        {  // step 15
          element: '.button_stat:first',
          title: 'Helpful:',
          content: 'Switch statistics from this cue to the tree up to this cue. And back.',
          placement: "right",
        },
        {  // step 16
          element: '#button_expand_all_white:not(.disabled)',
          title: 'Helpful:',
          content: 'Click "V" to show & hide statistics of ALL cues.',
          placement: "right",
        },
        {  // step 17
          element: '#drophere_tree1:not(.disabled)',
          title: 'Optional:',
          content: 'Drag and drop cues to the RIGHT tree area to build the SECOND tree and compare the statistics.',
          placement: "left",
        },
        
        {  // step 18
          element: '.button_export:first:not(.disabled)',
          title: 'Optional:',
          content: 'You can export the created tree to Server for further analysis.',
          placement: "bottom",
        },
        
        {  // step 19
          element: '.button_help',
          title: "That's it, have fun!",
          content: 'Click "?" to show these guiding tips again.',
          placement: "right",
        }],
        
    });
    
    // Initialize the tour
    tour.init();
    
    console.log('TIPS RUNNING!');
}