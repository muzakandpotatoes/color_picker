import React, { useState } from 'react';
import CustomColorPicker from './CustomColorPicker';
import { Button, TextField, Paper, Grid, Typography, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Divider } from '@mui/material';
import { colord } from "colord";

const ColorPicker = () => {
  const [color, setColor] = useState('#ffffff');
  const [slider, setSlider] = useState('h');
  const [colorMode, setColorMode] = useState('hsl');

  const handleChangeComplete = (color) => {
    setColor(color);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const hslColor = colord(color).toHsl();
  const hsvColor = colord(color).toHsv();

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '16px', backgroundColor: '#fafafa' }}>
        <Typography variant="h4" gutterBottom align="center" style={{ color: '#333', fontWeight: 600, marginBottom: '1.5rem' }}>
          Color Picker
        </Typography>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <CustomColorPicker color={color} onChange={handleChangeComplete} slider={slider} colorMode={colorMode} />
          </div>
          <div>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: color, 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minWidth: '200px'
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
            <FormLabel component="legend" style={{ color: '#555', fontWeight: 500 }}>Color Mode</FormLabel>
            <RadioGroup row aria-label="color-mode" name="color-mode" value={colorMode} onChange={(e) => {
              const newMode = e.target.value;
              setColorMode(newMode);
              if (slider === 'l' && newMode === 'hsv') {
                setSlider('v');
              } else if (slider === 'v' && newMode === 'hsl') {
                setSlider('l');
              }
            }}>
              <FormControlLabel value="hsl" control={<Radio />} label="HSL" />
              <FormControlLabel value="hsv" control={<Radio />} label="HSV" />
            </RadioGroup>
          </FormControl>
          <Divider orientation="vertical" flexItem style={{ margin: '1rem 0' }} />
          <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
            <FormLabel component="legend" style={{ color: '#555', fontWeight: 500 }}>Slider Control</FormLabel>
            <RadioGroup row aria-label="slider-control" name="slider-control" value={slider} onChange={(e) => setSlider(e.target.value)}>
              <FormControlLabel value="h" control={<Radio />} label="Hue" />
              <FormControlLabel value="s" control={<Radio />} label="Saturation" />
              <FormControlLabel value={colorMode === 'hsl' ? 'l' : 'v'} control={<Radio />} label={colorMode === 'hsl' ? 'Lightness' : 'Value'} />
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div>
            <TextField 
              label="Hex" 
              value={color} 
              fullWidth 
              InputProps={{ readOnly: true }}
              style={{ marginBottom: '0.5rem' }}
            />
            <Button 
              onClick={() => copyToClipboard(color)} 
              fullWidth 
              variant="contained" 
              style={{ backgroundColor: '#2196f3', color: 'white', borderRadius: '6px' }}
            >
              Copy
            </Button>
          </div>
          <div>
            <TextField 
              label="RGB" 
              value={`${colord(color).toRgb().r}, ${colord(color).toRgb().g}, ${colord(color).toRgb().b}`} 
              fullWidth 
              InputProps={{ readOnly: true }}
              style={{ marginBottom: '0.5rem' }}
            />
            <Button 
              onClick={() => copyToClipboard(`${colord(color).toRgb().r}, ${colord(color).toRgb().g}, ${colord(color).toRgb().b}`)} 
              fullWidth 
              variant="contained" 
              style={{ backgroundColor: '#4caf50', color: 'white', borderRadius: '6px' }}
            >
              Copy
            </Button>
          </div>
          <div>
            <TextField 
              label="HSL" 
              value={`${hslColor.h}, ${hslColor.s.toFixed(0)}, ${hslColor.l.toFixed(0)}`} 
              fullWidth 
              InputProps={{ readOnly: true }}
              style={{ marginBottom: '0.5rem' }}
            />
            <Button 
              onClick={() => copyToClipboard(`${hslColor.h}, ${hslColor.s.toFixed(0)}, ${hslColor.l.toFixed(0)}`)} 
              fullWidth 
              variant="contained" 
              style={{ backgroundColor: '#ff9800', color: 'white', borderRadius: '6px' }}
            >
              Copy
            </Button>
          </div>
          <div>
            <TextField 
              label="HSV" 
              value={`${hsvColor.h}, ${hsvColor.s.toFixed(0)}, ${hsvColor.v.toFixed(0)}`} 
              fullWidth 
              InputProps={{ readOnly: true }}
              style={{ marginBottom: '0.5rem' }}
            />
            <Button 
              onClick={() => copyToClipboard(`${hsvColor.h}, ${hsvColor.s.toFixed(0)}, ${hsvColor.v.toFixed(0)}`)} 
              fullWidth 
              variant="contained" 
              style={{ backgroundColor: '#9c27b0', color: 'white', borderRadius: '6px' }}
            >
              Copy
            </Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default ColorPicker;
