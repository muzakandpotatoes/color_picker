import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { colord } from "colord";

const ColorPickerSquare = ({ slider, color, onChange, colorMode }) => {
  const hslColor = useMemo(() => colord(color).toHsl(), [color]);
  const hsvColor = useMemo(() => colord(color).toHsv(), [color]);
  const squareRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateColor = useCallback((e) => {
    if (!squareRef.current) return;
    const rect = squareRef.current.getBoundingClientRect();
    
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    let xRatio = x / rect.width;
    let yRatio = 1 - y / rect.height;

    let newColor = colorMode === 'hsl' ? { ...hslColor } : { ...hsvColor };
    const thirdAxis = colorMode === 'hsl' ? 'l' : 'v';

    switch (slider) {
      case 'h':
        newColor.s = xRatio * 100;
        newColor[thirdAxis] = yRatio * 100;
        break;
      case 's':
        newColor.h = xRatio * 360;
        newColor[thirdAxis] = yRatio * 100;
        break;
      case 'l':
      case 'v':
        newColor.h = xRatio * 360;
        newColor.s = yRatio * 100;
        break;
      default:
        break;
    }
    
    const newHex = colord(newColor).toHex();
    onChange(newHex);
  }, [hslColor, hsvColor, onChange, slider, colorMode]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    updateColor(e);
  }, [updateColor]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateColor(e);
    }
  }, [isDragging, updateColor]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const { squareStyles, markerStyle, overlays } = useMemo(() => {
    const squareStyles = {};
    const markerStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 0 0 1.5px black, inset 0 0 0 1.5px black',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
    };
    const overlays = [];
    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    if (colorMode === 'hsl') {
      if (slider === 'h') {
          squareStyles.background = `hsl(${hslColor.h}, 100%, 50%)`;
          overlays.push(<div key="sat" style={{...overlayStyle, background: 'linear-gradient(to right, hsl(0, 0%, 50%), transparent)'}} />);
          overlays.push(<div key="light" style={{...overlayStyle, background: 'linear-gradient(to top, black, transparent 50%, white)'}} />);
          markerStyle.left = `${hslColor.s}%`;
          markerStyle.top = `${100 - hslColor.l}%`;
      } else if (slider === 's') {
          const hueGradient = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360].map(h => colord({h, s: hslColor.s, l: 50}).toHex()).join(',')})`;
          squareStyles.background = hueGradient;
          overlays.push(<div key="light" style={{...overlayStyle, background: 'linear-gradient(to top, black, transparent 50%, white)'}} />);
          markerStyle.left = `${(hslColor.h / 360) * 100}%`;
          markerStyle.top = `${100 - hslColor.l}%`;
      } else if (slider === 'l') {
          const hueGradient = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360].map(h => colord({h, s: 100, l: hslColor.l}).toHex()).join(',')})`;
          squareStyles.background = hueGradient;
          overlays.push(<div key="sat" style={{...overlayStyle, background: `linear-gradient(to top, hsl(0, 0%, ${hslColor.l}%), transparent)`}} />);
          markerStyle.left = `${(hslColor.h / 360) * 100}%`;
          markerStyle.top = `${100 - hslColor.s}%`;
      }
    } else if (colorMode === 'hsv') {
      if (slider === 'h') {
          squareStyles.background = `hsl(${hsvColor.h}, 100%, 50%)`;
          overlays.push(<div key="sat" style={{...overlayStyle, background: 'linear-gradient(to right, white, transparent)'}} />);
          overlays.push(<div key="val" style={{...overlayStyle, background: 'linear-gradient(to top, black, transparent)'}} />);
          markerStyle.left = `${hsvColor.s}%`;
          markerStyle.top = `${100 - hsvColor.v}%`;
      } else if (slider === 's') {
          const hueGradient = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360].map(h => colord({h, s: hsvColor.s, v: 100}).toHex()).join(',')})`;
          squareStyles.background = hueGradient;
          overlays.push(<div key="val" style={{...overlayStyle, background: 'linear-gradient(to top, black, transparent)'}} />);
          markerStyle.left = `${(hsvColor.h / 360) * 100}%`;
          markerStyle.top = `${100 - hsvColor.v}%`;
      } else if (slider === 'v') {
          const hueGradient = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360].map(h => colord({h, s: 100, v: hsvColor.v}).toHex()).join(',')})`;
          squareStyles.background = hueGradient;
          overlays.push(<div key="sat" style={{...overlayStyle, background: `linear-gradient(to top, ${colord({h: 0, s: 0, v: hsvColor.v}).toHex()}, transparent)`}} />);
          markerStyle.left = `${(hsvColor.h / 360) * 100}%`;
          markerStyle.top = `${100 - hsvColor.s}%`;
      }
    } else {
      throw new Error(`Unknown colorMode: ${colorMode}`);
    }

    return { squareStyles, markerStyle, overlays };
  }, [slider, hslColor, hsvColor, colorMode]);

  return (
    <div
      ref={squareRef}
      style={{
        width: '100%',
        height: '125px',
        position: 'relative',
        cursor: 'crosshair',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        ...squareStyles,
      }}
      onMouseDown={handleMouseDown}
    >
      {overlays}
      <div
        style={markerStyle}
      />
    </div>
  );
};

const CustomColorPicker = ({ color, onChange, colorMode = 'hsl' }) => {
  const hslColor = useMemo(() => colord(color).toHsl(), [color]);
  const hsvColor = useMemo(() => colord(color).toHsv(), [color]);
  const currentColor = colorMode === 'hsl' ? hslColor : hsvColor;

  const onHueChange = useCallback((newHue) => {
    const currentColor = colorMode === 'hsl' ? hslColor : hsvColor;
    const newColor = { ...currentColor, h: newHue };
    onChange(colord(newColor).toHex());
  }, [hslColor, hsvColor, onChange, colorMode]);

  const onSaturationChange = useCallback((newSaturation) => {
    const currentColor = colorMode === 'hsl' ? hslColor : hsvColor;
    const newColor = { ...currentColor, s: newSaturation };
    onChange(colord(newColor).toHex());
  }, [hslColor, hsvColor, onChange, colorMode]);

  const onThirdAxisChange = useCallback((newValue) => {
    const currentColor = colorMode === 'hsl' ? hslColor : hsvColor;
    const thirdAxis = colorMode === 'hsl' ? 'l' : 'v';
    const newColor = { ...currentColor, [thirdAxis]: newValue };
    onChange(colord(newColor).toHex());
  }, [hslColor, hsvColor, onChange, colorMode]);

  const thirdAxis = colorMode === 'hsl' ? 'l' : 'v';

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <ColorPickerSquare slider="h" color={color} onChange={onChange} colorMode={colorMode} />
        <ColorPickerSquare slider="s" color={color} onChange={onChange} colorMode={colorMode} />
        <ColorPickerSquare slider={thirdAxis} color={color} onChange={onChange} colorMode={colorMode} />
        <div style={{ 
          width: '100%', 
          height: '125px', 
          backgroundColor: color, 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="range"
          min="0"
          max="360"
          value={currentColor.h}
          onChange={(e) => onHueChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            borderRadius: '4px',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={currentColor.s}
          onChange={(e) => onSaturationChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            background: colorMode === 'hsl' 
              ? `linear-gradient(to right, hsl(${hslColor.h}, 0%, 50%), hsl(${hslColor.h}, 100%, 50%))`
              : `linear-gradient(to right, white, ${colord({h: hsvColor.h, s: 100, v: hsvColor.v}).toHex()})`,
            borderRadius: '4px',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={colorMode === 'hsl' ? hslColor.l : hsvColor.v}
          onChange={(e) => onThirdAxisChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            background: colorMode === 'hsl'
              ? `linear-gradient(to right, hsl(${hslColor.h}, ${hslColor.s}%, 0%), hsl(${hslColor.h}, ${hslColor.s}%, 50%), hsl(${hslColor.h}, ${hslColor.s}%, 100%))`
              : `linear-gradient(to right, black, ${colord({h: hsvColor.h, s: hsvColor.s, v: 100}).toHex()})`,
            borderRadius: '4px',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default CustomColorPicker;