/*
 * package com.example.taskmanagers.config;
 * 
 * import org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.security.config.annotation.web.configuration.
 * EnableWebSecurity;
 * 
 * import org.springframework.security.web.SecurityFilterChain; import
 * org.springframework.security.config.annotation.web.builders.HttpSecurity;
 * 
 * import org.springframework.security.core.userdetails.User; import
 * org.springframework.security.core.userdetails.UserDetailsService; import
 * org.springframework.security.provisioning.InMemoryUserDetailsManager;
 * 
 * import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 * import org.springframework.security.crypto.password.PasswordEncoder;
 * 
 * import org.springframework.http.HttpMethod;
 * 
 * @Configuration
 * 
 * @EnableWebSecurity public class SecurityConfiguration {
 * 
 * @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http)
 * throws Exception { http .csrf().disable() // Disable CSRF for Postman testing
 * .authorizeHttpRequests(auth -> auth // Allow USER and ADMIN to create task
 * .requestMatchers(HttpMethod.POST, "/api/tasks").hasAnyRole("ADMIN", "USER")
 * 
 * // Allow USER and ADMIN to update task by ID .requestMatchers(HttpMethod.PUT,
 * "/api/tasks/{id}").hasAnyRole("ADMIN", "USER")
 * 
 * // Allow USER and ADMIN to view task by ID .requestMatchers(HttpMethod.GET,
 * "/api/tasks/{id}").hasAnyRole("ADMIN", "USER")
 * 
 * // Only ADMIN can view all tasks or delete tasks
 * .requestMatchers("/api/tasks/**").hasRole("ADMIN")
 * 
 * // All other requests permitted (e.g. login page or test route)
 * .anyRequest().permitAll() ) .httpBasic(); // Basic Auth
 * 
 * return http.build(); }
 * 
 * @Bean public UserDetailsService userDetailsService(PasswordEncoder encoder) {
 * var admin = User.withUsername("admin") .password(encoder.encode("admin123"))
 * .roles("ADMIN") .build();
 * 
 * var user = User.withUsername("user") .password(encoder.encode("user123"))
 * .roles("USER") .build();
 * 
 * return new InMemoryUserDetailsManager(admin, user); }
 * 
 * @Bean public PasswordEncoder passwordEncoder() { return new
 * BCryptPasswordEncoder(); } }
 */

package com.example.taskmanagers.config;

import com.example.taskmanagers.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .cors() // ✅ enable cors
        .and()
        .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/**", "api/users/login").permitAll() // public login/signup

//             // Allow USER and ADMIN to create task
//              .requestMatchers(HttpMethod.POST, "/api/tasks").hasAnyRole("ADMIN", "USER")
//
//              // Allow USER and ADMIN to update task by ID
//              .requestMatchers(HttpMethod.PUT, "/api/tasks/{id}").hasAnyRole("ADMIN", "USER")
//
//              // Allow USER and ADMIN to view task by ID
//             .requestMatchers(HttpMethod.GET, "/api/tasks/{id}").hasAnyRole("ADMIN", "USER")
//             
//             .requestMatchers(HttpMethod.GET, "/api/tasks/").hasAnyRole("ADMIN", "USER")
//
//              // Only ADMIN can view all tasks or delete tasks
//              .requestMatchers("/api/tasks/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/tasks").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/tasks/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/tasks/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/tasks/user").hasAnyRole("ADMIN","USER")

                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}