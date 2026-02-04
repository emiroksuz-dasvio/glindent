#!/usr/bin/env python3
"""
Generate Glindent Welcome Video
Creates video frames using PIL and combines them with ffmpeg
"""

import os
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

# Settings
OUTPUT_DIR = Path("./public/videos")
DURATION = 10  # seconds
FPS = 30
WIDTH = 1920
HEIGHT = 1080
TEMP_DIR = Path("./temp_frames")

# Glindent Colors
COLORS = {
    "bg": "#000000",
    "primary": "#00A89A",
    "secondary": "#3ACCFF",
    "text": "#FFFFFF",
}

def create_frames():
    """Create video frames"""
    print("Creating video frames...")
    TEMP_DIR.mkdir(exist_ok=True)
    
    total_frames = DURATION * FPS
    
    for frame_idx in range(total_frames):
        # Calculate progress (0-1)
        progress = frame_idx / total_frames
        
        # Create frame image
        img = Image.new('RGB', (WIDTH, HEIGHT), COLORS["bg"])
        draw = ImageDraw.Draw(img)
        
        # Draw animated gradient bar
        bar_height = 200
        bar_y = HEIGHT // 2 - bar_height // 2
        
        # Animate bar appearance
        if progress < 0.3:
            alpha = progress / 0.3
            bar_width = int(WIDTH * alpha)
            draw.rectangle(
                [(WIDTH - bar_width) // 2, bar_y, 
                 (WIDTH + bar_width) // 2, bar_y + bar_height],
                fill=COLORS["primary"]
            )
        else:
            draw.rectangle(
                [0, bar_y, WIDTH, bar_y + bar_height],
                fill=COLORS["primary"]
            )
        
        # Save frame
        frame_path = TEMP_DIR / f"frame_{frame_idx:05d}.png"
        img.save(frame_path)
        
        if (frame_idx + 1) % 30 == 0:
            print(f"  Created {frame_idx + 1}/{total_frames} frames")
    
    print(f"✓ Created {total_frames} frames")

def create_video():
    """Combine frames into video using ffmpeg"""
    print("\nCreating video files...")
    
    if not subprocess.run(["ffmpeg", "-version"], 
                         capture_output=True).returncode == 0:
        print("❌ FFmpeg not found. Install it and try again.")
        return False
    
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # Create MP4
    print("  Creating MP4...")
    mp4_cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(TEMP_DIR / "frame_%05d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "23",
        str(OUTPUT_DIR / "welcome.mp4")
    ]
    subprocess.run(mp4_cmd, capture_output=True)
    
    # Create WebM
    print("  Creating WebM...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", str(OUTPUT_DIR / "welcome.mp4"),
        "-c:v", "libvpx-vp9",
        "-b:v", "1M",
        str(OUTPUT_DIR / "welcome.webm")
    ]
    subprocess.run(webm_cmd, capture_output=True)
    
    # Create Ogg
    print("  Creating Ogg...")
    ogv_cmd = [
        "ffmpeg", "-y",
        "-i", str(OUTPUT_DIR / "welcome.mp4"),
        "-c:v", "libtheora",
        "-q:v", "7",
        str(OUTPUT_DIR / "welcome.ogv")
    ]
    subprocess.run(ogv_cmd, capture_output=True)
    
    print("✓ Video creation complete")
    return True

def cleanup():
    """Remove temporary files"""
    print("\nCleaning up...")
    import shutil
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    print("✓ Cleaned up temporary files")

def main():
    print("🎬 Glindent Welcome Video Generator")
    print(f"📊 Resolution: {WIDTH}x{HEIGHT}")
    print(f"⏱️  Duration: {DURATION}s @ {FPS}fps")
    print()
    
    try:
        create_frames()
        if create_video():
            cleanup()
            
            # Show file info
            print("\n📁 Generated videos:")
            for file in OUTPUT_DIR.glob("welcome.*"):
                size_mb = file.stat().st_size / (1024 * 1024)
                print(f"  - {file.name} ({size_mb:.2f} MB)")
            
            print("\n✅ Welcome video ready!")
        else:
            cleanup()
            print("❌ Video creation failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        cleanup()

if __name__ == "__main__":
    main()
