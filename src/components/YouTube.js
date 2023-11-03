
import { useEffect, useRef, useState } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';



export default function CloudinaryMediaEditor({src ,publicId,startTime,endTime}) {
const config = {
  theme: 'dark',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.17.0/assets',
  ui: {
    elements: {
      view: 'advanced', // 'default' or 'advanced'
      navigation: {
        show: true, // 'false' to hide the navigation completely
        position: 'top', // 'top' or 'bottom'
        action: {
          close: true, // true or false
          back: true, // true or false
          load: true, // true or false
          save: true, // true or false
          export: {
            show: true,
            format: ['application/pdf']
          },
          download: true, // true  or false
          custom: [
            {
              label: 'common.custom', // string or i18n key
              iconName: 'default', // one of 'default', 'download', 'upload', or 'save'
              callback: () => {
                // callback signature is `() => void | Promise<void>`
                // place custom functionality here
              }
            }
          ]
        }
      },
      panels: {
        inspector: {
          show: true, // true or false
          position: 'left' // 'left' or 'right'
        },
        assetLibrary: {
          show: true, // true or false
          position: 'left' // 'left' or 'right'
        },
        settings: {
          show: true // true or false
        }
      },
      dock: {
        iconSize: 'large', // 'large' or 'normal'
        hideLabels: false, // false or true
        groups: [
          {
            id: 'ly.img.template', // string
            entryIds: ['ly.img.template'] // string[]
          },
          {
            id: 'ly.img.defaultGroup', // string
            showOverview: true // true or false
          }
        ],
        defaultGroupId: 'ly.img.defaultGroup' // string
      },
      libraries: {
        insert: {
          entries: (defaultEntries) => defaultEntries,
          floating: true, // true or false
          autoClose: false // true or false
        },
        replace: {
          entries: (defaultEntries) => defaultEntries,
          floating: true, // true or false
          autoClose: false // true or false
        }
      },
      blocks: {
        opacity: false, // true  or false
        transform: false, // true  or false
        '//ly.img.ubq/image': {
          adjustments: true, // true  or false
          filters: false, // true  or false
          effects: false, // true  or false
          blur: true, // true  or false
          crop: false // true  or false
        },
        '//ly.img.ubq/page': {
          manage: true,
          format: true,
          maxDuration: 30 * 60
        }
      }
    }
  },
  callbacks: {
    onUpload: 'local',
    onExport: 'local',
    onDownload: 'local',
    onCustom: 'local',
    onImport: 'local',
    onSourceChanged: 'local',
  }
};

CreativeEditorSDK.create('#cesdk', config).then(async (cesdk) => {


  await cesdk.addDefaultAssetSources();
  await cesdk.addDemoAssetSources();


  await cesdk.createVideoScene();


  // Adding some image after creating the scene
  const video = await cesdk.engine.asset.defaultApplyAsset({
    id: 'ly.img.cesdk.images.samples/sample.1',
    meta: {
      uri: 'http://res.cloudinary.com/delkyf33p/video/upload/so_163.88197/eo_208.63547/test1698651024315',
      width: "100%",
      height: "100%"
    }
  });


  if (video == null) return;


  // Select the first image after loading the scene ...
  cesdk.engine.block.setSelected(video, true);


  // ... and opening the replace asset library for the user to choose a differnt image
  if (!cesdk.ui.isPanelOpen('//ly.img.panel/assetLibrary.replace')) {
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary.replace');
  }
});

  return (
    <>
    </>
  );
} 