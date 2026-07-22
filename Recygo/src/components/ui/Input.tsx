import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
}

export function Input({ label, error, leftIcon, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithIcon : null, style]}
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E8ECEF',
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: '#2ECC71',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 16,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 6,
  },
});

