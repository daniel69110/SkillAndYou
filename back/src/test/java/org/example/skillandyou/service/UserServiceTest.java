package org.example.skillandyou.service;

import org.example.skillandyou.dto.UpdateUserDTO;
import org.example.skillandyou.dto.UserSearchDTO;
import org.example.skillandyou.entity.*;
import org.example.skillandyou.entity.enums.SkillType;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.PasswordResetTokenRepository;
import org.example.skillandyou.repository.ReviewRepository;
import org.example.skillandyou.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @Mock ReviewRepository reviewRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock PasswordResetTokenRepository passwordResetTokenRepository;

    @InjectMocks UserService userService;

    @Test
    void createUser_shouldThrow_whenEmailExists() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setUserName("bob");
        user.setPassword("Test1234!");

        when(userRepository.existsByEmail("test@mail.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(user));

        assertEquals("EMAIL_EXISTS", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_shouldThrow_whenUsernameExists() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setUserName("bob");
        user.setPassword("Test1234!");

        when(userRepository.existsByEmail("test@mail.com")).thenReturn(false);
        when(userRepository.existsByUserName("bob")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.createUser(user));

        assertEquals("USERNAME_EXISTS", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_shouldEncodePassword_andSetDefaultPhoto_whenNeeded() {
        User user = new User();
        user.setEmail("new@mail.com");
        user.setUserName("newUser");
        user.setPassword("plainPassword");
        user.setPhotoUrl(null);

        when(userRepository.existsByEmail("new@mail.com")).thenReturn(false);
        when(userRepository.existsByUserName("newUser")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.createUser(user);

        assertEquals("$2a$encoded", saved.getPassword());
        assertEquals("/images/default-avatar.jpg", saved.getPhotoUrl());
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_shouldNotReencodePassword_whenAlreadyBCryptLike() {
        User user = new User();
        user.setEmail("new@mail.com");
        user.setUserName("newUser");
        user.setPassword("$2a$alreadyEncoded");
        user.setPhotoUrl("x");

        when(userRepository.existsByEmail("new@mail.com")).thenReturn(false);
        when(userRepository.existsByUserName("newUser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.createUser(user);

        assertEquals("$2a$alreadyEncoded", saved.getPassword());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_shouldUpdateFields_andSave() {
        Long id = 1L;

        User existing = new User();
        existing.setId(id);
        existing.setFirstName("OldFirst");
        existing.setLastName("OldLast");
        existing.setUserName("oldUser");
        existing.setBio("old bio");
        existing.setCity("OldCity");
        existing.setCountry("OldCountry");
        existing.setPostalCode("00000");
        existing.setPhotoUrl("old.jpg");
        existing.setVisibleInSearch(true);

        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setFirstName("NewFirst");
        dto.setLastName(null);
        dto.setUserName("newUser");

        dto.setBio("new bio");
        dto.setCity("Lyon");
        dto.setCountry("FR");
        dto.setPostalCode("69000");
        dto.setPhotoUrl("new.jpg");

        dto.setVisibleInSearch(false);

        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.updateUser(id, dto);

        assertAll(
                () -> assertEquals("NewFirst", saved.getFirstName()),
                () -> assertEquals("OldLast", saved.getLastName()),
                () -> assertEquals("newUser", saved.getUserName()),

                () -> assertEquals("new bio", saved.getBio()),
                () -> assertEquals("Lyon", saved.getCity()),
                () -> assertEquals("FR", saved.getCountry()),
                () -> assertEquals("69000", saved.getPostalCode()),
                () -> assertEquals("new.jpg", saved.getPhotoUrl()),

                () -> assertEquals(false, saved.isVisibleInSearch())
        );

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals(id, captor.getValue().getId());
    }

    @Test
    void updateUser_shouldNotChangeVisibleInSearch_whenNull() {
        Long id = 2L;

        User existing = new User();
        existing.setId(id);
        existing.setVisibleInSearch(true);

        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setVisibleInSearch(null);


        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.updateUser(id, dto);

        assertEquals(true, saved.isVisibleInSearch());
        verify(userRepository).save(existing);
    }

    @Test
    void updateUser_shouldThrow_whenUserNotFound() {
        Long id = 404L;
        UpdateUserDTO dto = new UpdateUserDTO();

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> userService.updateUser(id, dto));
        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteAccount_shouldThrow_whenPasswordInvalid() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setPassword("$2a$encodedPassword");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "$2a$encodedPassword")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.deleteAccount(id, "wrongPassword"));

        assertEquals("INVALID_PASSWORD", ex.getMessage());
        verify(userRepository, never()).deleteById(any());
        verify(reviewRepository, never()).deleteByReviewerId(any());
    }

    @Test
    void deleteAccount_shouldDeleteUserAndReviews_whenPasswordValid() {
        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setPassword("$2a$encodedPassword");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correctPassword", "$2a$encodedPassword")).thenReturn(true);

        userService.deleteAccount(id, "correctPassword");

        verify(reviewRepository).deleteByReviewerId(id);
        verify(reviewRepository).deleteByReviewedUserId(id);
        verify(userRepository).deleteById(id);
    }


    @Test
    void recalculateAverageRating_shouldSetNull_whenNoReviews() {
        Long userId = 1L;

        User user = new User();
        user.setId(userId);
        user.setAverageRating(BigDecimal.valueOf(4.5));

        when(reviewRepository.findByReviewedUserId(userId)).thenReturn(List.of());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        userService.recalculateAverageRating(userId);

        assertNull(user.getAverageRating());
        verify(userRepository).save(user);
    }

    @Test
    void recalculateAverageRating_shouldComputeCorrectAverage() {
        Long userId = 1L;

        User user = new User();
        user.setId(userId);

        Review r1 = new Review(); r1.setRating(4);
        Review r2 = new Review(); r2.setRating(5);
        Review r3 = new Review(); r3.setRating(3);

        when(reviewRepository.findByReviewedUserId(userId)).thenReturn(List.of(r1, r2, r3));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        userService.recalculateAverageRating(userId);

        assertEquals(BigDecimal.valueOf(4.00).setScale(2), user.getAverageRating());
        verify(userRepository).save(user);
    }

    @Test
    void createPasswordResetToken_shouldThrow_whenEmailNotFound() {
        when(userRepository.findByEmail("unknown@mail.com")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.createPasswordResetToken("unknown@mail.com"));

        assertEquals("NO_USER_FOR_EMAIL", ex.getMessage());
        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void createPasswordResetToken_shouldCreateAndSaveToken_whenEmailExists() {
        User user = new User();
        user.setEmail("user@mail.com");

        when(userRepository.findByEmail("user@mail.com")).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        String token = userService.createPasswordResetToken("user@mail.com");

        assertNotNull(token);
        assertFalse(token.isEmpty());

        ArgumentCaptor<PasswordResetToken> captor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(passwordResetTokenRepository).save(captor.capture());

        PasswordResetToken saved = captor.getValue();
        assertEquals(user, saved.getUser());
        assertFalse(saved.isUsed());
        assertNotNull(saved.getExpirationDate());
        assertTrue(saved.getExpirationDate().isAfter(LocalDateTime.now()));
    }

    @Test
    void resetPassword_shouldThrow_whenTokenNotFound() {
        when(passwordResetTokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.resetPassword("invalid-token", "newPassword"));

        assertEquals("INVALID_TOKEN", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_shouldThrow_whenTokenAlreadyUsed() {
        PasswordResetToken token = new PasswordResetToken();
        token.setUsed(true);
        token.setExpirationDate(LocalDateTime.now().plusHours(1));

        when(passwordResetTokenRepository.findByToken("used-token")).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.resetPassword("used-token", "newPassword"));

        assertEquals("TOKEN_EXPIRED_OR_USED", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_shouldThrow_whenTokenExpired() {
        PasswordResetToken token = new PasswordResetToken();
        token.setUsed(false);
        token.setExpirationDate(LocalDateTime.now().minusHours(1));

        when(passwordResetTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.resetPassword("expired-token", "newPassword"));

        assertEquals("TOKEN_EXPIRED_OR_USED", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_shouldEncodePassword_andMarkTokenUsed_whenValid() {
        User user = new User();
        user.setPassword("$2a$oldPassword");

        PasswordResetToken token = new PasswordResetToken();
        token.setUsed(false);
        token.setExpirationDate(LocalDateTime.now().plusHours(1));
        token.setUser(user);

        when(passwordResetTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("newPassword")).thenReturn("$2a$newEncoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        userService.resetPassword("valid-token", "newPassword");

        assertEquals("$2a$newEncoded", user.getPassword());
        assertTrue(token.isUsed());
        verify(userRepository).save(user);
        verify(passwordResetTokenRepository).save(token);
    }

    @Test
    void searchUsers_shouldReturnOnlyVisibleAndActiveUsers() {
        User visibleUser = new User();
        visibleUser.setId(1L);
        visibleUser.setFirstName("Jean");
        visibleUser.setLastName("Dupont");
        visibleUser.setUserName("jdupont");
        visibleUser.setVisibleInSearch(true);
        visibleUser.setStatus(Status.ACTIVE);
        visibleUser.setUserSkills(new ArrayList<>());

        User hiddenUser = new User();
        hiddenUser.setId(2L);
        hiddenUser.setVisibleInSearch(false);
        hiddenUser.setStatus(Status.ACTIVE);
        hiddenUser.setUserSkills(new ArrayList<>());

        when(userRepository.findByStatus(Status.ACTIVE)).thenReturn(List.of(visibleUser, hiddenUser));

        List<UserSearchDTO> results = userService.searchUsers(null, null, null);

        assertEquals(1, results.size());
        assertEquals("jdupont", results.get(0).getUserName());
    }

    @Test
    void searchUsers_shouldFilterBySkill() {
        Skill skill = new Skill();
        skill.setId(1L);
        skill.setName("Java");
        skill.setCategory("Dev");

        UserSkill userSkill = new UserSkill();
        userSkill.setSkill(skill);
        userSkill.setType(SkillType.OFFER);
        userSkill.setLevel(3);

        User user = new User();
        user.setId(1L);
        user.setFirstName("Jean");
        user.setLastName("Dupont");
        user.setUserName("jdupont");
        user.setVisibleInSearch(true);
        user.setStatus(Status.ACTIVE);
        user.setUserSkills(List.of(userSkill));
        userSkill.setUser(user);

        User userSansSkill = new User();
        userSansSkill.setId(2L);
        userSansSkill.setVisibleInSearch(true);
        userSansSkill.setStatus(Status.ACTIVE);
        userSansSkill.setUserSkills(new ArrayList<>());

        when(userRepository.findByStatus(Status.ACTIVE)).thenReturn(List.of(user, userSansSkill));

        List<UserSearchDTO> results = userService.searchUsers("java", null, null);

        assertEquals(1, results.size());
        assertEquals("jdupont", results.get(0).getUserName());
    }

    @Test
    void searchUsers_shouldFilterByCity() {
        User userLyon = new User();
        userLyon.setId(1L);
        userLyon.setFirstName("Jean");
        userLyon.setLastName("Dupont");
        userLyon.setUserName("jdupont");
        userLyon.setCity("Lyon");
        userLyon.setVisibleInSearch(true);
        userLyon.setStatus(Status.ACTIVE);
        userLyon.setUserSkills(new ArrayList<>());

        User userParis = new User();
        userParis.setId(2L);
        userParis.setFirstName("Marie");
        userParis.setLastName("Martin");
        userParis.setUserName("mmartin");
        userParis.setCity("Paris");
        userParis.setVisibleInSearch(true);
        userParis.setStatus(Status.ACTIVE);
        userParis.setUserSkills(new ArrayList<>());

        when(userRepository.findByStatus(Status.ACTIVE)).thenReturn(List.of(userLyon, userParis));

        List<UserSearchDTO> results = userService.searchUsers(null, "lyon", null);

        assertEquals(1, results.size());
        assertEquals("jdupont", results.get(0).getUserName());
    }


}
