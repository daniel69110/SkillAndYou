package org.example.skillandyou.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.skillandyou.dto.CreateExchangeRequestDTO;
import org.example.skillandyou.dto.ExchangeDTO;
import org.example.skillandyou.entity.Exchange;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.ExchangeStatus;
import org.example.skillandyou.repository.ExchangeRepository;
import org.example.skillandyou.repository.SkillRepository;
import org.example.skillandyou.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeServiceTest {

    @Mock ExchangeRepository exchangeRepository;
    @Mock UserRepository userRepository;
    @Mock SkillRepository skillRepository;
    @Mock NotificationService notificationService;

    @InjectMocks ExchangeService exchangeService;

    private User makeUser(Long id, String firstName, String lastName) {
        User u = new User();
        u.setId(id);
        u.setFirstName(firstName);
        u.setLastName(lastName);
        u.setUserName(firstName.toLowerCase());
        return u;
    }

    private Skill makeSkill(Long id, String name) {
        Skill s = new Skill();
        s.setId(id);
        s.setName(name);
        s.setCategory("Dev");
        return s;
    }

    @Test
    void createExchange_shouldThrow_whenRequesterNotFound() {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO();
        req.setRequesterId(99L);
        req.setReceiverId(2L);
        req.setOfferedSkillId(1L);
        req.setRequestedSkillId(2L);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> exchangeService.createExchange(req));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void createExchange_shouldThrow_whenReceiverNotFound() {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO();
        req.setRequesterId(1L);
        req.setReceiverId(99L);
        req.setOfferedSkillId(1L);
        req.setRequestedSkillId(2L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(makeUser(1L, "Jean", "Dupont")));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> exchangeService.createExchange(req));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void createExchange_shouldThrow_whenOfferedSkillNotFound() {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO();
        req.setRequesterId(1L);
        req.setReceiverId(2L);
        req.setOfferedSkillId(99L);
        req.setRequestedSkillId(2L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(makeUser(1L, "Jean", "Dupont")));
        when(userRepository.findById(2L)).thenReturn(Optional.of(makeUser(2L, "Marie", "Martin")));
        when(skillRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> exchangeService.createExchange(req));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void createExchange_shouldCreatePendingExchange_andNotifyReceiver() {
        CreateExchangeRequestDTO req = new CreateExchangeRequestDTO();
        req.setRequesterId(1L);
        req.setReceiverId(2L);
        req.setOfferedSkillId(1L);
        req.setRequestedSkillId(2L);

        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        when(userRepository.findById(1L)).thenReturn(Optional.of(requester));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(skillRepository.findById(1L)).thenReturn(Optional.of(offeredSkill));
        when(skillRepository.findById(2L)).thenReturn(Optional.of(requestedSkill));
        when(exchangeRepository.save(any(Exchange.class))).thenAnswer(inv -> {
            Exchange e = inv.getArgument(0);
            e.setId(10L);
            return e;
        });

        ExchangeDTO result = exchangeService.createExchange(req);

        assertEquals(ExchangeStatus.PENDING.name(), result.getStatus());
        assertEquals("Jean", result.getRequester().getFirstName());
        assertEquals("Marie", result.getReceiver().getFirstName());

        ArgumentCaptor<Exchange> captor = ArgumentCaptor.forClass(Exchange.class);
        verify(exchangeRepository).save(captor.capture());
        assertEquals(ExchangeStatus.PENDING, captor.getValue().getStatus());
        assertNotNull(captor.getValue().getCreationDate());

        verify(notificationService).createNotification(
                eq(2L),
                eq("EXCHANGE_CREATED"),
                anyString(),
                eq(10L),
                anyString()
        );
    }

    // acceptExchange

    @Test
    void acceptExchange_shouldThrow_whenExchangeNotFound() {
        when(exchangeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> exchangeService.acceptExchange(99L, 2L));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void acceptExchange_shouldThrow_whenWrongReceiver() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(IllegalStateException.class,
                () -> exchangeService.acceptExchange(1L, 99L));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void acceptExchange_shouldThrow_whenStatusNotPending() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setStatus(ExchangeStatus.ACCEPTED); // déjà accepté

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(IllegalStateException.class,
                () -> exchangeService.acceptExchange(1L, 2L));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void acceptExchange_shouldSetAccepted_andNotifyRequester() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));
        when(exchangeRepository.save(any(Exchange.class))).thenAnswer(inv -> inv.getArgument(0));

        ExchangeDTO result = exchangeService.acceptExchange(1L, 2L);

        assertEquals(ExchangeStatus.ACCEPTED.name(), result.getStatus());
        assertNotNull(exchange.getAcceptanceDate());

        verify(notificationService).createNotification(
                eq(1L),
                eq("EXCHANGE_ACCEPTED"),
                anyString(),
                eq(1L),
                anyString()
        );
    }

    // ======= completeExchange =======

    @Test
    void completeExchange_shouldThrow_whenStatusNotAccepted() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.PENDING); // pas ACCEPTED

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(IllegalStateException.class,
                () -> exchangeService.completeExchange(1L));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void completeExchange_shouldSetCompleted_andNotifyBothUsers() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.ACCEPTED);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));
        when(exchangeRepository.save(any(Exchange.class))).thenAnswer(inv -> inv.getArgument(0));

        ExchangeDTO result = exchangeService.completeExchange(1L);

        assertEquals(ExchangeStatus.COMPLETED.name(), result.getStatus());
        assertNotNull(exchange.getCompletionDate());


        verify(notificationService).createNotification(
                eq(1L), eq("EXCHANGE_COMPLETED"), anyString(), eq(1L), anyString()
        );
        verify(notificationService).createNotification(
                eq(2L), eq("EXCHANGE_COMPLETED"), anyString(), eq(1L), anyString()
        );
    }


    // ======= cancelExchange =======

    @Test
    void cancelExchange_shouldThrow_whenStatusIsCompleted() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.COMPLETED); // ne peut pas être annulé

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));

        assertThrows(IllegalStateException.class,
                () -> exchangeService.cancelExchange(1L));
        verify(exchangeRepository, never()).save(any());
    }

    @Test
    void cancelExchange_shouldSetCancelled_whenStatusIsPending() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.PENDING);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));
        when(exchangeRepository.save(any(Exchange.class))).thenAnswer(inv -> inv.getArgument(0));

        ExchangeDTO result = exchangeService.cancelExchange(1L);

        assertEquals(ExchangeStatus.CANCELLED.name(), result.getStatus());
        verify(exchangeRepository).save(exchange);
    }

    @Test
    void cancelExchange_shouldSetCancelled_whenStatusIsAccepted() {
        User requester = makeUser(1L, "Jean", "Dupont");
        User receiver = makeUser(2L, "Marie", "Martin");
        Skill offeredSkill = makeSkill(1L, "Java");
        Skill requestedSkill = makeSkill(2L, "Python");

        Exchange exchange = new Exchange();
        exchange.setId(1L);
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.ACCEPTED);

        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(exchange));
        when(exchangeRepository.save(any(Exchange.class))).thenAnswer(inv -> inv.getArgument(0));

        ExchangeDTO result = exchangeService.cancelExchange(1L);

        assertEquals(ExchangeStatus.CANCELLED.name(), result.getStatus());
        verify(exchangeRepository).save(exchange);
    }

}
