import React, { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { RNCamera as Camera, CameraType, FlashMode } from "react-native-camera";
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps
} from "react-native-ui-kitten";

import { Touchable } from "@src/components/common";
import { FlashOnIcon, FlashOffIcon } from "@src/assets/icons";
import ZoomView from "./zoomview";

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;
const MAX_ZOOM = 8; // iOS only
const ZOOM_F = Platform.OS === "ios" ? 0.0005 : 0.08;

export type Props = ThemedComponentProps & {
  onBarcode?: (barcode: any) => void;
};

const CameraComponent = ({ themedStyle, onBarcode }: Props) => {
  const [zoom, setZoom] = useState<number>(0);
  const [pinch, setPinch] = useState<number>(0);
  const [permission, setPermission] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string | undefined>();

  const [type, setType] = useState<CameraType>(CameraTypes.back);
  const [flash, setFlash] = useState<FlashMode>(CameraFlashModes.off);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setPermission(status === "granted");
    };

    getPermission();
  }, []);

  const toggleType = () => {
    setType(type === CameraTypes.back ? CameraTypes.front : CameraTypes.back);
  };

  const toggleFlash = () => {
    setFlash(
      flash === CameraFlashModes.off
        ? CameraFlashModes.torch
        : CameraFlashModes.off
    );
  };

  const handleBarcode = (event: any) => {
    const { data, type: codeType } = event;
    setBarcode(event);
    if (onBarcode) onBarcode(event);
  };

  const renderBarcode = ({ bounds, data }: any) => (
    <React.Fragment key={data}>
      <Layout
        style={[
          themedStyle.barcodeMask,
          {
            height: parseFloat(bounds.size.height),
            width: parseFloat(bounds.size.width),
            left: parseFloat(bounds.origin.x),
            top: parseFloat(bounds.origin.y)
          }
        ]}
      >
        {/* <Text
          style={{
            color: '#F00',
            flex: 1,
            position: 'absolute',
            textAlign: 'center',
            backgroundColor: 'transparent',
          }}>
          {data}
        </Text> */}
      </Layout>
    </React.Fragment>
  );

  if (permission === null) {
    return <Layout />;
  }
  if (permission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <ZoomView
      style={themedStyle.flex}
      onZoomProgress={(p: number) => {
        const p2 = p - pinch;
        setPinch(p);
        if (p2 > 0 && p2 > ZOOM_F) {
          setZoom(Math.min(zoom + ZOOM_F, 1));
        } else if (p2 < 0 && p2 < -ZOOM_F) {
          setZoom(Math.max(zoom - ZOOM_F, 0));
        }
      }}
      onZoomStart={() => {
        setPinch(1);
      }}
      onZoomEnd={() => {
        setPinch(1);
      }}
    >
      <Camera
        maxZoom={MAX_ZOOM}
        zoom={zoom}
        style={themedStyle.flex}
        type={type}
        flashMode={flash}
        onBarCodeRead={handleBarcode}
      >
        <>
          {/* {barcode && renderBarcode(barcode)} */}
          <Layout
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row"
            }}
          >
            <Layout style={themedStyle.crosshairContainer}>
              <Layout style={themedStyle.crosshair} />
            </Layout>
            <Touchable
              feedback="opacity"
              style={themedStyle.control}
              onPress={toggleFlash}
            >
              {flash === CameraFlashModes.off ? (
                <FlashOnIcon style={themedStyle.controlIcon} />
              ) : (
                <FlashOffIcon style={themedStyle.controlIcon} />
              )}
            </Touchable>
            {/* <Touchable
              feedback="opacity"
              style={themedStyle.control}
              onPress={toggleType}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'red' }}>
                Flip
              </Text>
            </Touchable> */}
          </Layout>
        </>
      </Camera>
    </ZoomView>
  );
};

export default withStyles(CameraComponent, theme => ({
  flex: {
    flex: 1
  },
  crosshairContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  crosshair: {
    borderWidth: 2,
    borderRadius: 4,
    width: 200,
    height: 200,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  control: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginBottom: 16
  },
  controlIcon: {
    height: 38,
    width: 38,
    color: theme["text-control-color"]
  },
  barcodeMask: {
    borderWidth: 2,
    borderRadius: 4,
    position: "absolute",
    borderColor: theme["color-primary-transparent-200"],
    justifyContent: "center",
    backgroundColor: theme["color-primary-transparent-100"],
    padding: 10
  }
}));
