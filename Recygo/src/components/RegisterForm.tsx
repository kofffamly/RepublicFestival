import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    console.log('Register:', formData);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Full Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(v) => handleChange('fullName', v)}
            placeholder="John Doe"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(v) => handleChange('email', v)}
            placeholder="john@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Phone Number */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(v) => handleChange('phoneNumber', v)}
            placeholder="+1 (555) 000-0000"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(v) => handleChange('password', v)}
            placeholder="Create a password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            placeholder="Confirm your password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Terms */}
      <View style={styles.termsRow}>
        <View style={styles.checkbox}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.termsText}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </View>

      {/* Submit Button */}
      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkMark: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '800',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
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
});

