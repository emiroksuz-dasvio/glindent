#!/bin/bash
# Script to generate welcome video in multiple formats
# This creates a branded welcome video with Glindent theme colors

# Colors matching Glindent theme
PRIMARY_COLOR="#00A89A"
SECONDARY_COLOR="#3ACCFF"
TEXT_COLOR="#FFFFFF"
BG_COLOR="#000000"

# Video settings
WIDTH=1920
HEIGHT=1080
FPS=30
DURATION=10
OUTPUT_DIR="./public/videos"

echo "Creating Glindent Welcome Video..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed. Please install FFmpeg to generate videos."
    echo "Windows: choco install ffmpeg"
    echo "Mac: brew install ffmpeg"
    echo "Linux: sudo apt-get install ffmpeg"
    exit 1
fi

# Create directory
mkdir -p "$OUTPUT_DIR"

# Create a 10-second welcome video with gradients and text
# This uses ffmpeg to generate a video from scratch
ffmpeg -f lavfi -i "color=c='#000000':s=${WIDTH}x${HEIGHT}:d=${DURATION}" \
  -i "color=c='#00A89A':s=${WIDTH}x${HEIGHT}:d=${DURATION}" \
  -filter_complex "
    [0:v]scale=${WIDTH}:${HEIGHT}[base];
    [1:v]scale=${WIDTH}x100:1[bar];
    [base][bar]overlay=0:(H-h)/2:enable='between(t,0,${DURATION})'[v1];
    [v1]drawtext=text='Welcome to Glindent':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=100:fontcolor='#FFFFFF':x='(w-text_w)/2':y='(h-text_h)/2-100':enable='between(t,0,${DURATION})'[v2];
    [v2]drawtext=text='Discover Premium Dental Supplies':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:fontsize=50:fontcolor='#3ACCFF':x='(w-text_w)/2':y='(h-text_h)/2+100':enable='between(t,0,${DURATION})'[v3];
    [v3]scale=${WIDTH}:${HEIGHT}[out]
  " \
  -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p \
  -r ${FPS} \
  "${OUTPUT_DIR}/welcome.mp4" \
  -y

# Create WebM version for better compression
ffmpeg -i "${OUTPUT_DIR}/welcome.mp4" \
  -c:v libvpx-vp9 \
  -b:v 1M \
  -pass 1 \
  -f null \
  /dev/null \
  -y

ffmpeg -i "${OUTPUT_DIR}/welcome.mp4" \
  -c:v libvpx-vp9 \
  -b:v 1M \
  -pass 2 \
  "${OUTPUT_DIR}/welcome.webm" \
  -y

# Create Ogg version for additional compatibility
ffmpeg -i "${OUTPUT_DIR}/welcome.mp4" \
  -c:v libtheora \
  -q:v 7 \
  "${OUTPUT_DIR}/welcome.ogv" \
  -y

echo "✅ Videos created successfully!"
echo "📁 Location: ${OUTPUT_DIR}/"
ls -lh "${OUTPUT_DIR}/"
