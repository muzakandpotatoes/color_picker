import React, { useState } from 'react';
import CustomColorPicker from './CustomColorPicker';
import { Button, TextField, Paper, Typography, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { colord } from "colord";

const ColorPicker = () => {
  const [color, setColor] = useState('#40bfbf');
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
        <div style={{ marginBottom: '1.5rem' }}>
          <CustomColorPicker color={color} onChange={handleChangeComplete} colorMode={colorMode} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
            <FormLabel component="legend" style={{ color: '#555', fontWeight: 500 }}>Color Mode</FormLabel>
            <RadioGroup row aria-label="color-mode" name="color-mode" value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
              <FormControlLabel value="hsl" control={<Radio />} label="HSL" />
              <FormControlLabel value="hsv" control={<Radio />} label="HSV" />
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
