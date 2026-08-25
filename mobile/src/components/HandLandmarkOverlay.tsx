import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { LandmarkPoint } from '../types';
import { HAND_CONNECTIONS } from '../services/landmark';
import { colors } from '../theme';

interface Props {
  points: LandmarkPoint[];
  width: number;
  height: number;
}

export const HandLandmarkOverlay: React.FC<Props> = ({ points, width, height }) => {
  if (!points || points.length === 0 || width <= 0 || height <= 0) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Draw Skeleton Bones */}
        {HAND_CONNECTIONS.map(([startIdx, endIdx], i) => {
          const start = points[startIdx];
          const end = points[endIdx];
          if (!start || !end) return null;

          return (
            <Line
              key={`bone_${i}`}
              x1={start.x * width}
              y1={start.y * height}
              x2={end.x * width}
              y2={end.y * height}
              stroke={colors.landmarkBone}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw 21 Hand Landmark Joints */}
        {points.map((pt, idx) => {
          const isWrist = idx === 0;
          const isFingertip = [4, 8, 12, 16, 20].includes(idx);
          const r = isFingertip ? 7 : isWrist ? 9 : 5;
          const fillColor = isWrist ? colors.warning : isFingertip ? colors.accent : colors.landmarkJoint;

          return (
            <Circle
              key={`joint_${idx}`}
              cx={pt.x * width}
              cy={pt.y * height}
              r={r}
              fill={fillColor}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}
      </Svg>
    </View>
  );
};
