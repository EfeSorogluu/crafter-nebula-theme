"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { userService } from "@/lib/api/services/userService";
import { giftService } from "@/lib/api/services/giftService";
import { chestService } from "@/lib/api/services/chestService";
import { User } from "@/lib/types/user";
import { ChestItem } from "@/lib/types/chest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Gift,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wallet,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import ChestItemCard from "@/components/chest/chest-item-card";

interface GiftPageProps {
  currency?: string;
}

export default function GiftPage({ currency = "Kredi" }: GiftPageProps) {
  const { user, isAuthenticated, reloadUser } = useContext(AuthContext);
  const giftApi = giftService();
  const userApiService = userService();
  const chestApi = chestService();

  // Gift Type State
  const [giftType, setGiftType] = useState<"balance" | "item">("balance");

  // Send Gift State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Chest Items State
  const [chestItems, setChestItems] = useState<ChestItem[]>([]);
  const [isLoadingChestItems, setIsLoadingChestItems] = useState(false);
  const [selectedChestItem, setSelectedChestItem] = useState<ChestItem | null>(
    null
  );

  // Fetch chest items when switching to item tab
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      giftType === "item" &&
      chestItems.length === 0
    ) {
      const fetchChestItems = async () => {
        setIsLoadingChestItems(true);
        try {
          const items = await chestApi.getChestItems(user.id);
          setChestItems(items);
        } catch (error) {
          console.error("Error fetching chest items:", error);
          toast.error("Sandık eşyaları yüklenirken bir hata oluştu.");
        } finally {
          setIsLoadingChestItems(false);
        }
      };

      fetchChestItems();
    }
  }, [giftType, user, isAuthenticated, chestItems.length]);

  const handleSearchUser = async () => {
    if (!searchQuery.trim()) {
      toast.error("Lütfen bir kullanıcı adı girin.");
      return;
    }

    try {
      setIsSearching(true);
      setSelectedUser(null);
      const foundUser = await userApiService.getUserById(searchQuery.trim());

      if (foundUser.id === user?.id) {
        toast.error("Kendinize hediye gönderemezsiniz.");
        return;
      }

      setSelectedUser(foundUser);
    } catch (err: any) {
      console.error("Failed to find user:", err);
      toast.error("Kullanıcı bulunamadı.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    if (!selectedUser) {
      toast.error("Lütfen bir kullanıcı seçin.");
      return;
    }

    setIsSending(true);
    try {
      if (giftType === "balance") {
        const amountValue = parseFloat(amount);
        if (!amountValue || amountValue <= 0) {
          toast.error("Geçerli bir miktar girin.");
          setIsSending(false);
          return;
        }

        const result = await giftApi.sendBalanceGift(user.id, {
          targetUserId: selectedUser.id,
          amount: amountValue,
        });

        if (result.success) {
          toast.success("Kredi başarıyla gönderildi!");
          setAmount("");
          setSelectedUser(null);
          setSearchQuery("");
          await reloadUser(); // Update balance
        } else {
          toast.error(result.message || "Hediye gönderilemedi.");
        }
      } else {
        // Send Chest Item
        if (!selectedChestItem) {
          toast.error("Lütfen gönderilecek bir eşya seçin.");
          setIsSending(false);
          return;
        }

        const result = await giftApi.sendChestItemGift(
          user.id,
          selectedUser.id,
          selectedChestItem.id
        );

        if (result.success) {
          toast.success("Eşya başarıyla gönderildi!");
          setSelectedChestItem(null);
          setSelectedUser(null);
          setSearchQuery("");
          // Refresh chest items
          const items = await chestApi.getChestItems(user.id);
          setChestItems(items);
        } else {
          toast.error(result.message || "Eşya gönderilemedi.");
        }
      }
    } catch (error: any) {
      console.error("Send gift error:", error);
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Gift className="w-4 h-4" />
              <span>Hediyeleşme & Transfer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Hediye Merkezi
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Arkadaşlarınıza kredi veya sandık eşyası gönderin. Paylaşmak
              güzeldir!
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Gift className="w-16 h-16 md:w-20 md:h-20 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border/50 bg-card/50 shadow-xl shadow-primary/5 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Hediye Gönder
                </CardTitle>
                <CardDescription>
                  Kullanıcı adı girerek kredi veya eşya transferi yapın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {!isAuthenticated ? (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/10 border-red-500/20 text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Giriş Yapmalısınız</AlertTitle>
                    <AlertDescription>
                      Hediye göndermek için lütfen giriş yapın.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Step 1: Search User */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground ml-1">
                        Alıcı Kullanıcı
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative flex gap-2">
                          <div className="relative flex-1">
                            <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="Kullanıcı adı girin..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSearchUser()
                              }
                              className="pl-12 h-12 bg-background border-border/50 focus:border-primary/50 rounded-xl text-lg"
                              disabled={!!selectedUser}
                            />
                          </div>
                          {selectedUser ? (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 rounded-xl border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setSelectedUser(null);
                                setSearchQuery("");
                              }}
                            >
                              <XCircle className="w-5 h-5" />
                            </Button>
                          ) : (
                            <Button
                              className="h-12 px-6 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                              onClick={handleSearchUser}
                              disabled={isSearching}
                            >
                              {isSearching ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Search className="w-5 h-5" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected User Preview */}
                    <AnimatePresence>
                      {selectedUser && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 flex items-center gap-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <Avatar className="w-14 h-14 border-2 border-background shadow-lg ring-2 ring-primary/10">
                              <AvatarImage
                                src={`https://mc-heads.net/avatar/${selectedUser.username}`}
                              />
                              <AvatarFallback>
                                {selectedUser.username[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 relative z-10">
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                {selectedUser.username}
                                <Badge
                                  variant="secondary"
                                  className="bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0 h-5"
                                >
                                  Doğrulandı
                                </Badge>
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Hediye alıcısı
                              </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator className="bg-border/50" />

                    {/* Gift Type Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground ml-1">
                        Hediye Türü
                      </label>
                      <Tabs
                        value={giftType}
                        onValueChange={(v) => setGiftType(v as any)}
                        className="w-full"
                      >
                        <TabsList className="w-full grid grid-cols-2 h-12 p-1 bg-muted/50 rounded-xl">
                          <TabsTrigger
                            value="balance"
                            className="rounded-lg h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Kredi Gönder
                          </TabsTrigger>
                          <TabsTrigger
                            value="item"
                            className="rounded-lg h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Eşya Gönder
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Amount or Item Selection */}
                    {giftType === "balance" ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-muted-foreground ml-1">
                            Gönderilecek Miktar
                          </label>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                            Bakiye: {user?.balance || 0} {currency}
                          </span>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                          <div className="relative">
                            <Wallet className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-12 h-12 bg-background border-border/50 focus:border-primary/50 rounded-xl text-lg font-mono font-medium"
                              min="0"
                            />
                            <div className="absolute right-4 top-3.5 text-sm font-bold text-muted-foreground">
                              {currency}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-muted-foreground ml-1">
                            Gönderilecek Eşya
                          </label>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                            Eşya Sayısı: {chestItems.length}
                          </span>
                        </div>

                        {isLoadingChestItems ? (
                          <div className="flex items-center justify-center py-8 border border-dashed border-border rounded-xl">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : chestItems.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                            {chestItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedChestItem(item)}
                                className={`cursor-pointer transition-all ${
                                  selectedChestItem?.id === item.id
                                    ? "ring-2 ring-primary"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                              >
                                <ChestItemCard
                                  item={item}
                                  hideActions
                                  compact
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                            Sandığınızda gönderilecek eşya bulunmuyor.
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={handleSendGift}
                      disabled={
                        isSending ||
                        !selectedUser ||
                        (giftType === "balance" && !amount) ||
                        (giftType === "item" && !selectedChestItem)
                      }
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          İşlem Yapılıyor...
                        </>
                      ) : (
                        <>
                          Transferi Tamamla{" "}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Info / Tips */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Bilgilendirme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p>
                    Kredi transferleri anında gerçekleşir ve alıcının bakiyesine
                    yansır.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <p>
                    Sandık eşyası gönderdiğinizde eşya sizin sandığınızdan
                    silinir ve alıcının sandığına eklenir.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <p>
                    Hatalı gönderimlerde işlem geri alınamaz, lütfen kullanıcı
                    adını kontrol ediniz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}