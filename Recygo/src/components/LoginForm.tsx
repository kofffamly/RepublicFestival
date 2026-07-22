import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    console.log('Login:', { phoneNumber, password });
  };

  return (
    <View style={styles.container}>
      {/* Phone Number Input */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 (555) 000-0000"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Forgot Password */}
      <View style={styles.forgotRow}>
        <Pressable>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Submit Button */}
      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Sign In</Text>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login */}
      <View style={styles.socialRow}>
        <Pressable style={styles.socialButton}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialLabel}>Google</Text>
        </Pressable>
        <Pressable style={styles.socialButton}>
          <Text style={styles.socialIcon}>f</Text>
          <Text style={styles.socialLabel}>Facebook</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 14,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334155',
  },
  socialLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
});

